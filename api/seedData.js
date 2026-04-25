import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const categories = [
    {
        text: 'Fresh Vegetables',
        path: 'vegetables',
        image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=2070&auto=format&fit=crop',
        bgColor: '#E8F5E9',
        description: 'Straight from the farm to your kitchen.'
    },
    {
        text: 'Organic Fruits',
        path: 'fruits',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop',
        bgColor: '#FFF3E0',
        description: 'Sweet, juicy and packed with vitamins.'
    },
    {
        text: 'Dairy & Eggs',
        path: 'dairy',
        image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=1912&auto=format&fit=crop',
        bgColor: '#E3F2FD',
        description: 'Fresh milk, cheese, and farm-fresh eggs.'
    },
    {
        text: 'Grains & Rice',
        path: 'grains',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop',
        bgColor: '#F5F5F5',
        description: 'Premium quality rice and healthy grains.'
    },
    {
        text: 'Traditional Spices',
        path: 'spices',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop',
        bgColor: '#FBE9E7',
        description: 'Authentic flavors of the land.'
    }
];

const products = [
    // Vegetables
    {
        name: 'Fresh Red Tomatoes (1kg)',
        category: 'vegetables',
        price: 60,
        offerPrice: 45,
        image: [
            'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2070&auto=format&fit=crop'
        ],
        description: ['Freshly harvested', 'Organic certified', 'Rich in Lycopene'],
        inStock: true
    },
    {
        name: 'Organic Carrots (500g)',
        category: 'vegetables',
        price: 40,
        offerPrice: 32,
        image: [
            'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1974&auto=format&fit=crop'
        ],
        description: ['Crunchy and sweet', 'Perfect for salads', 'Farm fresh'],
        inStock: true
    },
    {
        name: 'Green Capsicum (250g)',
        category: 'vegetables',
        price: 30,
        offerPrice: 25,
        image: [
            'https://images.unsplash.com/photo-1563513307168-d0cc08e5e89a?q=80&w=2070&auto=format&fit=crop'
        ],
        description: ['Fresh and green', 'Rich in Vitamin C'],
        inStock: true
    },
    // Fruits
    {
        name: 'Premium Shimla Apples (1kg)',
        category: 'fruits',
        price: 180,
        offerPrice: 150,
        image: [
            'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=1974&auto=format&fit=crop'
        ],
        description: ['Crispy and juicy', 'Direct from orchards', 'No wax coating'],
        inStock: true
    },
    {
        name: 'Golden Bananas (1 Dozen)',
        category: 'fruits',
        price: 60,
        offerPrice: 50,
        image: [
            'https://images.unsplash.com/photo-1571771894821-ad9b5886479b?q=80&w=2080&auto=format&fit=crop'
        ],
        description: ['Naturally ripened', 'Rich in potassium', 'Daily energy booster'],
        inStock: true
    },
    {
        name: 'Fresh Nagpur Oranges (1kg)',
        category: 'fruits',
        price: 120,
        offerPrice: 99,
        image: [
            'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1965&auto=format&fit=crop'
        ],
        description: ['Sweet and tangy', 'Vitamin C rich'],
        inStock: true
    },
    // Dairy
    {
        name: 'Fresh Whole Milk (1L)',
        category: 'dairy',
        price: 75,
        offerPrice: 68,
        image: [
            'https://images.unsplash.com/photo-1563636619-e9107da4a1bb?q=80&w=1964&auto=format&fit=crop'
        ],
        description: ['Pure farm milk', 'Pasteurized', 'Rich in calcium'],
        inStock: true
    },
    {
        name: 'Artisan Butter (200g)',
        category: 'dairy',
        price: 150,
        offerPrice: 135,
        image: [
            'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=2070&auto=format&fit=crop'
        ],
        description: ['Creamy and delicious', 'Pure salted butter'],
        inStock: true
    },
    // Grains
    {
        name: 'Premium Basmati Rice (5kg)',
        category: 'grains',
        price: 650,
        offerPrice: 599,
        image: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop'
        ],
        description: ['Extra long grain', 'Aromatic flavor', 'Aged for 2 years'],
        inStock: true
    },
    // Spices
    {
        name: 'Pure Turmeric Powder (200g)',
        category: 'spices',
        price: 80,
        offerPrice: 65,
        image: [
            'https://images.unsplash.com/photo-1615485245781-804814f09c8a?q=80&w=2070&auto=format&fit=crop'
        ],
        description: ['High Curcumin content', 'No artificial colors', 'Pure and natural'],
        inStock: true
    },
    {
        name: 'Black Pepper Corns (100g)',
        category: 'spices',
        price: 120,
        offerPrice: 105,
        image: [
            'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1974&auto=format&fit=crop'
        ],
        description: ['Strong aroma', 'Freshly packed'],
        inStock: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        
        console.log('🗑️ Existing data cleared');

        // Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ ${createdCategories.length} Categories seeded`);

        // Insert products
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ ${createdProducts.length} Products seeded`);

        console.log('🌟 Database Seeding Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedData();
