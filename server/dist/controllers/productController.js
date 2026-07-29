import { prisma } from "../config/prisma.js";
// GET /api/products/flash-deals
export const getFlashDeals = async (req, res) => {
    const products = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { originalPrice: "desc", },
    });
    const productsWithDiscount = products.map((p) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount, };
    });
    res.json({ products: productsWithDiscount.slice(0, 8) });
};
// GET /api/products
export const getProducts = async (req, res) => {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const where = {};
    if (category && category !== "all")
        where.category = category;
    if (search)
        where.name = { contains: search, mode: "insensitive" };
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice)
            where.price.gte = Number(minPrice);
        if (maxPrice)
            where.price.lte = Number(maxPrice);
    }
    const orderBy = {};
    if (sort === "price-low")
        orderBy.price = "asc";
    else if (sort === "price-high")
        orderBy.price = "desc";
    else
        orderBy.createdAt = 'desc';
    const products = await prisma.product.findMany({ where, orderBy });
    const productsWithDiscount = products.map((p) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount };
    });
    res.json({ products: productsWithDiscount });
};
// GET /api/products/:id
export const getProduct = async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }
    const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    res.json({ product: { ...product, discount } });
};
// POST /api/products
export const createProduct = async (req, res) => {
    const product = await prisma.product.create({
        data: req.body,
    });
    res.status(201).json({ product });
};
// PUT /api/products/:id
export const updateProduct = async (req, res) => {
    const product = await prisma.product.update({
        where: {
            id: req.params.id,
        },
        data: req.body,
    });
    res.json({ product });
};
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    await prisma.product.update({
        where: { id: req.params.id },
        data: { stock: Number(0) }
    });
    res.json({ message: "Product Updated" });
};
