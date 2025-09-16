import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb.js';
import Reservation from '../../../../models/Reservation.js';
import Contact from '../../../../models/Contact.js';
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

// Helper function to get admin from request
const getAdminFromRequest = (request) => {
  try {
    return verifyAdminToken(request);
  } catch (error) {
    const decoded = getTokenFromCookies(request);
    if (!decoded) {
      throw new Error('Unauthorized');
    }
    return decoded;
  }
};

// GET - Admin Dashboard Statistics
export async function GET(request) {
  try {
    // Verify admin authentication
    getAdminFromRequest(request);

    await connectDB();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Reservation statistics
    const reservationStats = await Promise.all([
      // Total reservations
      Reservation.countDocuments(),
      
      // Reservations by status
      Reservation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Today's reservations
      Reservation.countDocuments({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }),
      
      // This week's reservations
      Reservation.countDocuments({
        createdAt: { $gte: thisWeek }
      }),
      
      // This month's reservations
      Reservation.countDocuments({
        createdAt: { $gte: thisMonth }
      }),
      
      // Recent reservations
      Reservation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // Contact statistics
    const contactStats = await Promise.all([
      // Total contacts
      Contact.countDocuments(),
      
      // Contacts by status
      Contact.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // New contacts today
      Contact.countDocuments({
        createdAt: { $gte: today }
      }),
      
      // Unread contacts
      Contact.countDocuments({
        status: 'new'
      }),
      
      // Recent contacts
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // Format the response
    const dashboard = {
      reservations: {
        total: reservationStats[0],
        byStatus: reservationStats[1].reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        today: reservationStats[2],
        thisWeek: reservationStats[3],
        thisMonth: reservationStats[4],
        recent: reservationStats[5].map(reservation => ({
          ...reservation,
          _id: reservation._id.toString(),
          date: reservation.date.toISOString(),
          createdAt: reservation.createdAt.toISOString()
        }))
      },
      contacts: {
        total: contactStats[0],
        byStatus: contactStats[1].reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        today: contactStats[2],
        unread: contactStats[3],
        recent: contactStats[4].map(contact => ({
          ...contact,
          _id: contact._id.toString(),
          createdAt: contact.createdAt.toISOString()
        }))
      },
      summary: {
        pendingReservations: reservationStats[1].find(s => s._id === 'pending')?.count || 0,
        newContacts: contactStats[3],
        todayActivity: reservationStats[2] + contactStats[2]
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboard
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
        data: null
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch dashboard data',
      data: null
    }, { status: 500 });
  }
}
