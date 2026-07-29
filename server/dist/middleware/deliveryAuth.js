import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
const deliveryAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "delivery") {
            return res.status(403).json({
                message: "Access denied. Delivery partner only."
            });
        }
        const partner = await prisma.deliveryPartner.findUnique({
            where: { id: decoded.id }
        });
        if (!partner || !partner.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }
        req.partner = partner;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        return res.status(401).json({ message: "Token is not valid" });
    }
};
export default deliveryAuth;
