import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const stripeWebhook = async (
    request: Request,
    response: Response
) => {
    let event: Stripe.Event;

    try {
        const signature = request.headers["stripe-signature"] as string;

        event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
        );
    } catch (err: any) {
        console.log(
            "⚠️ Webhook signature verification failed.",
            err.message
        );

        return response.sendStatus(400);
    }

    try {
        switch (event.type) {

            case "payment_intent.succeeded": {

                const paymentIntent = event.data.object as any;

                const paymentIntentId = paymentIntent.id;

                // Get checkout session
                const session = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const { orderId } = session.data[0].metadata as any;

                // Mark order paid
                const paidOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { isPaid: true },
                });

                // Update stock
                const orderItems = Array.isArray(paidOrder.items)
                    ? paidOrder.items
                    : [];

                for (const item of orderItems as any[]) {
                    await prisma.product.update({
                        where: { id: item.product },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }

                // Send order placed event
                await inngest.send({
                    name: "order/placed",
                    data: { orderId },
                });

                // Send stock update events
                for (const item of orderItems as any[]) {
                    await inngest.send({
                        name: "inventory/stock.updated",
                        data: {
                            productId: item.product,
                        },
                    });
                }

                break;
            }

            case "payment_intent.canceled":
            case "payment_intent.payment_failed": {

                const paymentIntentFailure = event.data.object as any;

                const paymentIntentFailureId =
                    paymentIntentFailure.id;

                // Get checkout session
                const sessionFailure =
                    await stripe.checkout.sessions.list({
                        payment_intent: paymentIntentFailureId,
                    });

                const failureOrderId =
                    sessionFailure.data[0].metadata?.orderId;

                if (failureOrderId) {
                    await prisma.order.delete({
                        where: { id: failureOrderId },
                    });
                }

                break;
            }

            default:
                console.log(
                    `Unhandled event type ${event.type}`
                );
        }

        response.json({ received: true });

    } catch (error: any) {
        console.log(error);
        response.status(500).json({
            message: "Webhook Error",
        });
    }
};