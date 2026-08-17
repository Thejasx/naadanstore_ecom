import express from 'express';
import Coupon from '../models/Coupon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all active coupons
router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find({ active: true }).sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST apply coupon code
router.post('/apply', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
        }

        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
        }

        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`
            });
        }

        let discount = Math.round((orderAmount * coupon.discountPercentage) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }

        res.json({
            success: true,
            message: `Coupon ${coupon.code} applied successfully!`,
            discount,
            coupon
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create coupon (Admin)
router.post('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { code, discountPercentage, minOrderAmount, maxDiscount, description } = req.body;
        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountPercentage: Number(discountPercentage),
            minOrderAmount: Number(minOrderAmount) || 0,
            maxDiscount: Number(maxDiscount) || 500,
            description: description || '',
        });

        res.status(201).json({ success: true, message: 'Coupon created', coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE coupon (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
