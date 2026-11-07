import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Wipe existing data to prevent duplicates
    await Order.deleteMany();
    await User.deleteMany();

    // 2. Create an admin user 
    // We use User.create() instead of insertMany() so your bcrypt pre('save') hook triggers
    await User.create({
      name: 'Admin User',
      email: 'admin@purepetcanvas.com',
      password: 'password123', // This will be hashed automatically by the model
      isAdmin: true,
    });

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await User.deleteMany();
    console.log('Database Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

// Allows you to run: node seeder -d (to destroy) or node seeder (to import)
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
