import { prisma } from "../config/prisma.js";
// Get user addresses
// GET /api/addresses
export const getAddresses = async (req, res) => {
    const addresses = await prisma.address.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "asc" },
    });
    res.json({ addresses });
};
// Add address
// POST /api/addresses
export const addAddress = async (req, res) => {
    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;
    // Require coordinates
    if (lat == null || lng == null) {
        return res.status(400).json({
            message: "Location coordinates are required. Please allow location access.",
        });
    }
    const currentAddresses = await prisma.address.findMany({
        where: { userId: req.user.id },
    });
    let makeDefault = isDefault;
    if (currentAddresses.length === 0)
        makeDefault = true;
    if (makeDefault) {
        await prisma.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false }
        });
    }
    await prisma.address.create({
        data: {
            userId: req.user.id,
            label,
            address,
            city,
            state,
            zip,
            isDefault: makeDefault,
            lat: Number(lat),
            lng: Number(lng)
        }
    });
    const addresses = await prisma.address.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "asc" }
    });
    res.status(201).json({ addresses });
};
// Update address
// PUT /api/addresses/:id
export const updateAddress = async (req, res) => {
    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;
    // Require coordinates
    if (lat == null || lng == null) {
        return res.status(400).json({
            message: "Location coordinates are required. Please allow location access.",
        });
    }
    // Remove previous default address
    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId: req.user.id, isDefault: true },
            data: { isDefault: false },
        });
    }
    const data = {};
    if (label)
        data.label = label;
    if (address)
        data.address = address;
    if (city)
        data.city = city;
    if (state)
        data.state = state;
    if (zip)
        data.zip = zip;
    if (isDefault !== undefined)
        data.isDefault = isDefault;
    if (lat != null)
        data.lat = Number(lat);
    if (lng != null)
        data.lng = Number(lng);
    try {
        await prisma.address.update({
            where: { id: req.params.id },
            data,
        });
    }
    catch (err) {
        return res.status(404).json({ message: "Address not found" });
    }
    const addresses = await prisma.address.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "asc" }
    });
    res.json({ addresses });
};
// Delete address
// DELETE /api/addresses/:id
export const deleteAddress = async (req, res) => {
    try {
        await prisma.address.delete({
            where: {
                id: req.params.id,
            },
        });
    }
    catch (err) {
        console.log(err.message);
    }
    const addresses = await prisma.address.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "asc" }
    });
    res.json({ addresses });
};
