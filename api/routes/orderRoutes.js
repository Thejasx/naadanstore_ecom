import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders/place
// @desc    Place a new order (COD)
// @access  Private
router.post('/place', auth, async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user.id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.json({ success: true, message: "Order Placed", order: newOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/userorders
// @desc    Get user's orders
// @access  Private
router.get('/userorders', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
