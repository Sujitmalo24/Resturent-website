// Admin Seeder Script
// Run this script to create a default admin user for testing

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

import connectDB from '../lib/mongodb.js';
import Admin from '../models/Admin.js';

const createDefaultAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Create new admin user
    const adminData = {
      username: 'admin',
      email: 'admin@restaurant.com',
      password: 'admin123', // Will be hashed automatically
      firstName: 'Restaurant',
      lastName: 'Admin',
      role: 'admin'
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email/Username: admin@restaurant.com or admin');
    console.log('🔒 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createDefaultAdmin();
