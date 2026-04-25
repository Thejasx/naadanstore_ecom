import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@naadanstore.com' });

        if (adminExists) {
            console.log('Admin user already exists!');
            console.log('Email: admin@naadanstore.com');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@naadanstore.com',
            password: 'admin123',
            isAdmin: true,
        });

        console.log('✅ Admin user created successfully!');
        console.log('==========================================');
        console.log('Email: admin@naadanstore.com');
        console.log('Password: admin123');
        console.log('==========================================');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdminUser();
