import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb.js';
import Reservation from '../../../../../models/Reservation.js';
import Contact from '../../../../../models/Contact.js';
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

// Helper function to convert JSON to CSV
const jsonToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quote
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

// GET - Export data as CSV
export async function GET(request) {
  try {
    // Verify admin authentication
    getAdminFromRequest(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'reservations' or 'contacts'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!type || !['reservations', 'contacts'].includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid export type. Must be "reservations" or "contacts"',
        data: null
      }, { status: 400 });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    let data, headers, filename;

    if (type === 'reservations') {
      // Export reservations
      const query = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};
      const reservations = await Reservation.find(query)
        .sort({ date: -1 })
        .lean();

      headers = [
        'name', 'email', 'phone', 'date', 'time', 'guests', 'status', 
        'specialRequests', 'createdAt', 'updatedAt'
      ];

      data = reservations.map(reservation => ({
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date.toISOString().split('T')[0],
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status,
        specialRequests: reservation.specialRequests || '',
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString()
      }));

      filename = `reservations_${new Date().toISOString().split('T')[0]}.csv`;

    } else {
      // Export contacts
      const query = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .lean();

      headers = [
        'name', 'email', 'phone', 'subject', 'message', 'contactReason',
        'status', 'priority', 'adminNotes', 'createdAt', 'respondedAt'
      ];

      data = contacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        subject: contact.subject,
        message: contact.message.replace(/\n/g, ' '), // Replace newlines for CSV
        contactReason: contact.contactReason,
        status: contact.status,
        priority: contact.priority,
        adminNotes: contact.adminNotes || '',
        createdAt: contact.createdAt.toISOString(),
        respondedAt: contact.respondedAt ? contact.respondedAt.toISOString() : ''
      }));

      filename = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Convert to CSV
    const csv = jsonToCSV(data, headers);

    // Return CSV response
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
        data: null
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to export data',
      data: null
    }, { status: 500 });
  }
}
