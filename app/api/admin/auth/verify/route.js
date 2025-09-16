import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb.js';
import Admin from '../../../../../models/Admin.js';
import jwt from 'jsonwebtoken';

// JWT utilities (inline to avoid import issues)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const verifyAdminToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch (error) {
    throw new Error('Unauthorized access');
  }
};

const getTokenFromCookies = (request) => {
  try {
    const cookies = request.headers.get('cookie');
    if (!cookies) return null;
    const tokenCookie = cookies
      .split(';')
      .find(cookie => cookie.trim().startsWith('admin-token='));
    if (!tokenCookie) return null;
    const token = tokenCookie.split('=')[1];
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

// GET - Verify admin session
export async function GET(request) {
  try {
    await connectDB();

    let decoded;
    
    // Try to get token from Authorization header first
    try {
      decoded = verifyAdminToken(request);
    } catch (error) {
      // If header auth fails, try cookies
      decoded = getTokenFromCookies(request);
      if (!decoded) {
        return NextResponse.json({
          success: false,
          message: 'No valid token found',
          data: null
        }, { status: 401 });
      }
    }

    // Find admin in database to ensure they still exist and are active
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Admin account not found or inactive',
        data: null
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Session valid',
      data: {
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          fullName: admin.fullName,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Error verifying admin session:', error);
    return NextResponse.json({
      success: false,
      message: 'Invalid or expired session',
      data: null
    }, { status: 401 });
  }
}
