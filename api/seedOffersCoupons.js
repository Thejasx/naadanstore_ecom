import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/Coupon.js';
import Offer from './models/Offer.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleCoupons = [
    {
        code: 'NAADAN20',
        discountPercentage: 20,
        minOrderAmount: 200,
        maxDiscount: 150,
        description: 'Get 20% OFF on fresh vegetables & fruits!'
    },
    {
        code: 'FRESH50',
        discountPercentage: 15,
        minOrderAmount: 100,
        maxDiscount: 100,
        description: 'Flat 15% discount on daily groceries'
    },
    {
        code: 'WELCOME10',
        discountPercentage: 10,
        minOrderAmount: 50,
        maxDiscount: 50,
        description: 'Welcome gift: 10% OFF your first order'
    }
];

const sampleOffers = [
    {
        title: 'Fresh Harvest Mega Sale! 🌾',
        subtitle: 'Up to 30% OFF on organic fruits & farm vegetables',
        code: 'NAADAN20',
        badge: 'HOT DEAL 🔥',
        bgGradient: 'from-emerald-600 via-teal-600 to-emerald-800',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'Authentic Kerala Spices & Grains 🌶️',
        subtitle: 'Pure aroma, zero preservatives. Flat 15% OFF today',
        code: 'FRESH50',
        badge: 'TRENDING 🌟',
        bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop'
    }
];

const seed = async () => {
    try {
        await connectDB();
        await Coupon.deleteMany({});
        await Offer.deleteMany({});

        await Coupon.insertMany(sampleCoupons);
        await Offer.insertMany(sampleOffers);

        console.log('✅ Sample Coupons & Offers seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
