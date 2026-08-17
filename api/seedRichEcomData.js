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
        image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#E8F5E9',
        description: 'Farm-fresh organic vegetables harvested daily.'
    },
    {
        text: 'Organic Fruits',
        path: 'fruits',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#FFF3E0',
        description: 'Sweet, juicy, and naturally ripened seasonal fruits.'
    },
    {
        text: 'Traditional Spices',
        path: 'spices',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#FBE9E7',
        description: 'Authentic aromatic spices direct from Western Ghats.'
    },
    {
        text: 'Handicrafts & Crafts',
        path: 'crafts',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#EFEBE9',
        description: 'Traditional handmade Kerala crafts, brassware & coconut shell items.'
    },
    {
        text: 'Dairy & Farm Eggs',
        path: 'dairy',
        image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#E3F2FD',
        description: 'Pure country milk, artisan butter, ghee and free-range eggs.'
    },
    {
        text: 'Grains & Heritage Rice',
        path: 'grains',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#F5F5F5',
        description: 'Traditional Matta rice, Basmati and unpolished wholesome grains.'
    },
    {
        text: 'Coconut & Oils',
        path: 'coconut',
        image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#E0F2F1',
        description: 'Cold-pressed virgin coconut oil, desiccated coconut & palm jaggery.'
    },
    {
        text: 'Snacks & Savories',
        path: 'snacks',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281313?q=80&w=1000&auto=format&fit=crop',
        bgColor: '#FFFDE7',
        description: 'Crispy banana chips, jackfruit chips & traditional tea snacks.'
    }
];

const products = [
    // --- VEGETABLES ---
    {
        name: 'Farm Fresh Red Tomatoes (1kg)',
        category: 'vegetables',
        price: 60,
        offerPrice: 45,
        image: [
            'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Freshly harvested from organic farm', 'Rich in Lycopene and Vitamin C', 'No synthetic pesticides'],
        inStock: true
    },
    {
        name: 'Organic Crunchy Carrots (500g)',
        category: 'vegetables',
        price: 45,
        offerPrice: 35,
        image: [
            'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Sweet and crunchy', 'High in Beta-Carotene', 'Great for salads and juices'],
        inStock: true
    },
    {
        name: 'Fresh Green Capsicum (250g)',
        category: 'vegetables',
        price: 35,
        offerPrice: 28,
        image: [
            'https://images.unsplash.com/photo-1563513307168-d0cc08e5e89a?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Crisp green bell pepper', 'Rich in dietary fiber and antioxidants'],
        inStock: true
    },
    {
        name: 'Organic Red Onions (1kg)',
        category: 'vegetables',
        price: 50,
        offerPrice: 38,
        image: [
            'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Strong aromatic flavor', 'Essential kitchen staple', 'Long shelf life'],
        inStock: true
    },
    {
        name: 'Fresh Green Chillies (200g)',
        category: 'vegetables',
        price: 25,
        offerPrice: 20,
        image: [
            'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Spicy and pungent', 'Directly from local gardens'],
        inStock: true
    },

    // --- FRUITS ---
    {
        name: 'Shimla Premium Crisp Apples (1kg)',
        category: 'fruits',
        price: 180,
        offerPrice: 149,
        image: [
            'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Juicy and crisp texture', 'Direct orchard sourcing', 'Wax-free guaranteed'],
        inStock: true
    },
    {
        name: 'Golden Nendran Bananas (1 Dozen)',
        category: 'fruits',
        price: 70,
        offerPrice: 55,
        image: [
            'https://images.unsplash.com/photo-1571771894821-ad9b5886479b?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Naturally ripened', 'Rich in potassium and energy', 'Traditional Kerala banana variety'],
        inStock: true
    },
    {
        name: 'Nagpur Juicy Oranges (1kg)',
        category: 'fruits',
        price: 120,
        offerPrice: 95,
        image: [
            'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Sweet and refreshing citrus taste', 'Immunity booster rich in Vitamin C'],
        inStock: true
    },
    {
        name: 'Sweet Alphonso Mangoes (1kg)',
        category: 'fruits',
        price: 280,
        offerPrice: 220,
        image: [
            'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['King of mangoes', 'Rich aroma and luscious taste', '100% Organic carbide free'],
        inStock: true
    },

    // --- SPICES ---
    {
        name: 'Wayanad Black Pepper Corns (200g)',
        category: 'spices',
        price: 160,
        offerPrice: 135,
        image: [
            'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['High essential oil content', 'Bold king-size pepper corns', 'Sun-dried naturally'],
        inStock: true
    },
    {
        name: 'Pure Golden Turmeric Powder (250g)',
        category: 'spices',
        price: 90,
        offerPrice: 75,
        image: [
            'https://images.unsplash.com/photo-1615485245781-804814f09c8a?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['High Curcumin percentage (5%+)', 'No added color or fillers', 'Traditional stone ground'],
        inStock: true
    },
    {
        name: 'Green Cardamom Pods (100g)',
        category: 'spices',
        price: 350,
        offerPrice: 299,
        image: [
            'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['8mm extra bold green pods', 'Intense sweet aroma', 'Handpicked from Idukki hills'],
        inStock: true
    },
    {
        name: 'Cinnamon Bark Sticks (100g)',
        category: 'spices',
        price: 130,
        offerPrice: 110,
        image: [
            'https://images.unsplash.com/photo-1509358271058-acd05cc9326e?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Ceylon true cinnamon', 'Delicate sweet spicy flavor', 'Great for teas and baking'],
        inStock: true
    },

    // --- CRAFTS & HANDICRAFTS ---
    {
        name: 'Handcrafted Coconut Shell Teacups (Set of 2)',
        category: 'crafts',
        price: 499,
        offerPrice: 380,
        image: [
            'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['100% Eco-friendly and sustainable', 'Hand-polished with organic coconut oil', 'Unique artisan craft'],
        inStock: true
    },
    {
        name: 'Traditional Brass Nilavilakku Oil Lamp (8 inch)',
        category: 'crafts',
        price: 1299,
        offerPrice: 999,
        image: [
            'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Pure heavy brass casting', 'Traditional auspicious lamp', 'Handcrafted by Kerala artisans'],
        inStock: true
    },
    {
        name: 'Woven Vetiver Root Eco Hand Fan',
        category: 'crafts',
        price: 250,
        offerPrice: 199,
        image: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Aromatic natural vetiver fragrance', 'Cooling breeze effect', 'Traditional handcraft'],
        inStock: true
    },

    // --- DAIRY ---
    {
        name: 'Pure Desi Cow Ghee (500ml)',
        category: 'dairy',
        price: 450,
        offerPrice: 395,
        image: [
            'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Bilona traditional method', 'A2 grass-fed cow milk', 'Golden granular texture'],
        inStock: true
    },
    {
        name: 'Farm Fresh Country Milk (1L)',
        category: 'dairy',
        price: 75,
        offerPrice: 65,
        image: [
            'https://images.unsplash.com/photo-1563636619-e9107da4a1bb?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Pasteurized whole milk', 'Rich cream layer', 'Delivered daily in glass bottle'],
        inStock: true
    },
    {
        name: 'Free-Range Organic Eggs (Pack of 6)',
        category: 'dairy',
        price: 70,
        offerPrice: 58,
        image: [
            'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Country hen eggs', 'Yellow rich yolk', 'Antibiotic-free feed'],
        inStock: true
    },

    // --- GRAINS ---
    {
        name: 'Kerala Red Matta Rice (5kg)',
        category: 'grains',
        price: 380,
        offerPrice: 320,
        image: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Palakkad premium Matta', 'High fiber red pericarp', 'Parboiled traditional rice'],
        inStock: true
    },
    {
        name: 'Royal Basmati Rice Long Grain (5kg)',
        category: 'grains',
        price: 680,
        offerPrice: 590,
        image: [
            'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Aged 2 years for aromatic length', 'Fluffy non-sticky grains', 'Ideal for biryani & pulao'],
        inStock: true
    },

    // --- COCONUT & OILS ---
    {
        name: 'Cold Pressed Virgin Coconut Oil (1L)',
        category: 'coconut',
        price: 350,
        offerPrice: 295,
        image: [
            'https://images.unsplash.com/photo-1544378730-8b5104b18790?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Extracted from fresh coconut milk', 'Zero heat chemical free', 'Great for cooking and hair care'],
        inStock: true
    },
    {
        name: 'Pure Palm Jaggery / Karupatti (500g)',
        category: 'coconut',
        price: 180,
        offerPrice: 150,
        image: [
            'https://images.unsplash.com/photo-1615485245781-804814f09c8a?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Natural unrefined sweetener', 'Rich in iron and minerals', 'Traditional healthy sugar substitute'],
        inStock: true
    },

    // --- SNACKS ---
    {
        name: 'Kerala Coconut Oil Banana Chips (250g)',
        category: 'snacks',
        price: 120,
        offerPrice: 99,
        image: [
            'https://images.unsplash.com/photo-1621996346565-e3d5d6281313?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Fried in pure coconut oil', 'Thin and crunchy Nendran slices', 'Lightly salted classical taste'],
        inStock: true
    },
    {
        name: 'Crispy Jackfruit Chips (200g)',
        category: 'snacks',
        price: 140,
        offerPrice: 115,
        image: [
            'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop'
        ],
        description: ['Raw ripe jackfruit chips', 'Authentic traditional crunch', 'No artificial colors'],
        inStock: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing categories and products
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Existing catalog data cleared');

        // Insert Categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ ${createdCategories.length} Categories successfully created!`);

        // Insert Products
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ ${createdProducts.length} Products successfully created!`);

        console.log('==================================================');
        console.log('🌟 Comprehensive E-Commerce Catalog Seeding Done!');
        console.log('==================================================');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding catalog:', error.message);
        process.exit(1);
    }
};

seedData();
