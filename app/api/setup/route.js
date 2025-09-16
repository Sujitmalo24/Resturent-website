import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';
import Admin from '../../../models/Admin.js';

// POST - Create admin user (for initial setup only)
export async function POST(request) {
  try {
    await connectDB();

    // Check if any admin exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        data: null
      }, { status: 400 });
    }

    const body = await request.json();
    const { setupKey } = body;

    // Simple setup key check for security
    if (setupKey !== 'setup_admin_2024') {
      return NextResponse.json({
        success: false,
        message: 'Invalid setup key',
        data: null
      }, { status: 401 });
    }

    // Create default admin user
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

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create admin user',
      data: null
    }, { status: 500 });
  }
}
