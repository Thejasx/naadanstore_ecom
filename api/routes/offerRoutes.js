import express from 'express';
import Offer from '../models/Offer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all active offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find({ active: true }).sort({ createdAt: -1 });
        res.json({ success: true, offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create offer (Admin)
router.post('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { title, subtitle, code, badge, image, bgGradient } = req.body;
        const offer = await Offer.create({
            title,
            subtitle: subtitle || '',
            code: code || '',
            badge: badge || 'SPECIAL DEAL',
            image: image || '',
            bgGradient: bgGradient || 'from-emerald-600 to-teal-800'
        });

        res.status(201).json({ success: true, message: 'Offer banner created', offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE offer (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await Offer.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Offer banner deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
