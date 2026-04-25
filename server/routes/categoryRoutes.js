import express from 'express';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private/Admin
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { text, path, image, bgColor, description } = req.body;

        // Check if category path already exists
        const existingCategory = await Category.findOne({ path });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category path already exists' });
        }

        const category = new Category({
            text,
            path,
            image,
            bgColor,
            description,
        });

        const createdCategory = await category.save();
        res.status(201).json({ success: true, category: createdCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { text, path, image, bgColor, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check if new path conflicts with existing category
        if (path !== category.path) {
            const existingCategory = await Category.findOne({ path });
            if (existingCategory) {
                return res.status(400).json({ success: false, message: 'Category path already exists' });
            }
        }

        category.text = text || category.text;
        category.path = path || category.path;
        category.image = image || category.image;
        category.bgColor = bgColor || category.bgColor;
        category.description = description || category.description;

        const updatedCategory = await category.save();
        res.json({ success: true, category: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await category.deleteOne();
        res.json({ success: true, message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
