import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb.js';
import Admin from '../../../../../models/Admin.js';
import jwt from 'jsonwebtoken';

// JWT utilities (inline to avoid import issues)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'restaurant-app'
  });
};

const createAdminSession = (admin) => {
  const payload = {
    id: admin._id.toString(),
    username: admin.username,
    email: admin.email,
    role: admin.role,
    fullName: admin.fullName
  };
  
  return {
    token: generateToken(payload),
    admin: payload
  };
};

// Server-side validation for login
const validateLoginData = (data) => {
  const errors = {};

  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  }

  if (!data.password?.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// POST - Admin Login
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate input data
    const validation = validateLoginData(body);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        data: validation.errors
      }, { status: 400 });
    }

    const { username, password } = body;

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ],
      isActive: true
    });

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
        data: null
      }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
        data: null
      }, { status: 401 });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create session
    const session = createAdminSession(admin);

    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: session.admin,
        token: session.token
      }
    });

    // Set HTTP-only cookie for additional security
    response.cookies.set('admin-token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    return response;

  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
