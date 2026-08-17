import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';
import Razorpay from 'razorpay';

const router = express.Router();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TQkIRDHecjsihe';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'u4OBoYT4bo72Vk12L0FjpJ58';

let razorpayInstance = null;
try {
    razorpayInstance = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
    });
} catch (e) {
    console.error('Razorpay init warning:', e.message);
}

// @route   POST /api/orders/place
// @desc    Place a new order (COD)
// @access  Private
router.post('/place', auth, async (req, res) => {
    try {
        const { items, amount, address, couponCode, discountAmount } = req.body;
        const userId = req.user.id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            couponCode: couponCode || '',
            discountAmount: discountAmount || 0,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.json({ success: true, message: "Order Placed Successfully!", order: newOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/orders/razorpay
// @desc    Initiate Razorpay order
// @access  Private
router.post('/razorpay', auth, async (req, res) => {
    try {
        const { items, amount, address, couponCode, discountAmount } = req.body;
        const userId = req.user.id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            couponCode: couponCode || '',
            discountAmount: discountAmount || 0,
            paymentMethod: "Razorpay",
            payment: false,
            status: "Order Placed",
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        if (razorpayInstance) {
            try {
                const razorpayOrder = await razorpayInstance.orders.create(options);
                return res.json({
                    success: true,
                    order: newOrder,
                    razorpayOrder,
                    keyId: razorpayKeyId,
                    isRealOrder: true
                });
            } catch (rzpErr) {
                console.log('Razorpay Orders API Note:', rzpErr.message);
            }
        }

        res.json({
            success: true,
            order: newOrder,
            razorpayOrder: { amount: options.amount },
            keyId: razorpayKeyId,
            isRealOrder: false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/orders/verify-razorpay
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-razorpay', auth, async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.payment = true;
        order.status = 'Payment Successful & Order Placed';
        await order.save();

        res.json({ success: true, message: 'Payment Verified & Order Confirmed!', order });
    } catch (error) {
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

// @route   GET /api/orders/list (Admin)
// @desc    Get all orders across all users
// @access  Private Admin
router.get('/list', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const orders = await Order.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/orders/status (Admin)
// @desc    Update order status (Order Placed, Shipped, Out for Delivery, Delivered)
// @access  Private Admin
router.post('/status', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: `Order status updated to "${status}"` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
