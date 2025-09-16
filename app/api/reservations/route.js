import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';
import Reservation from '../../../models/Reservation.js';
import { sendReservationConfirmation, sendReservationAlert, sendReservationStatusUpdate } from '../../../lib/email.js';

// Server-side validation
const validateReservationData = (data) => {
  const errors = {};

  // Name validation (combining firstName and lastName into single name field)
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  if (!fullName) {
    errors.name = 'Name is required';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const reservationDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (reservationDate < today) {
      errors.date = 'Please select a future date';
    }
  }

  // Time validation
  if (!data.time) {
    errors.time = 'Time is required';
  } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    errors.time = 'Please enter a valid time in HH:MM format';
  }

  // Guests validation
  if (!data.guests || parseInt(data.guests) < 1) {
    errors.guests = 'Number of guests must be at least 1';
  } else if (parseInt(data.guests) > 20) {
    errors.guests = 'Cannot exceed 20 guests';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Check for booking conflicts (same date/time)
const checkBookingConflicts = async (date, time) => {
  try {
    const conflicts = await Reservation.find({
      date: new Date(date),
      time: time,
      status: { $ne: 'cancelled' }
    });
    
    // For demo purposes, allow up to 3 bookings per time slot
    return conflicts.length >= 3;
  } catch (error) {
    console.error('Error checking booking conflicts:', error);
    return false;
  }
};

// POST - Create new reservation
export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const body = await request.json();
    
    // Validate input data
    const validation = validateReservationData(body);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        data: validation.errors
      }, { status: 400 });
    }

    // Check for booking conflicts
    const hasConflict = await checkBookingConflicts(body.date, body.time);
    if (hasConflict) {
      return NextResponse.json({
        success: false,
        message: 'This time slot is fully booked. Please select a different time.',
        data: null
      }, { status: 409 });
    }

    // Create new reservation object
    const reservationData = {
      name: `${body.firstName?.trim() || ''} ${body.lastName?.trim() || ''}`.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      date: new Date(body.date),
      time: body.time,
      guests: parseInt(body.guests),
      specialRequests: body.specialRequests || body.occasion || '',
      status: 'pending'
    };

    // Create and save reservation with pending status
    const newReservation = new Reservation(reservationData);
    const savedReservation = await newReservation.save();

    // Send admin alert email only (customer gets confirmation after admin approval)
    sendReservationAlert(savedReservation.toObject()).catch(error => {
      console.error('Failed to send admin alert email:', error);
    });
    
    // Return success response - reservation is pending approval
    return NextResponse.json({
      success: true,
      message: 'Reservation request submitted successfully! We will review your request and send you a confirmation within 24 hours.',
      data: {
        reservationId: savedReservation._id,
        confirmationNumber: savedReservation._id,
        status: savedReservation.status,
        date: savedReservation.date.toISOString(),
        time: savedReservation.time
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating reservation:', error);
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        data: validationErrors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.',
      data: null
    }, { status: 500 });
  }
}

// GET - Retrieve reservations (admin only - for demo purposes)
export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const email = searchParams.get('email');
    
    // Build query filters
    const filters = {};
    if (date) {
      const queryDate = new Date(date);
      filters.date = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }
    if (email) {
      filters.email = email.toLowerCase();
    }

    // Fetch reservations from MongoDB
    const reservations = await Reservation.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Reservations retrieved successfully',
      data: {
        reservations: reservations.map(reservation => ({
          ...reservation,
          // Don't expose sensitive information in API responses
          phone: reservation.phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2'),
          _id: reservation._id.toString(),
          date: reservation.date.toISOString().split('T')[0],
          createdAt: reservation.createdAt.toISOString(),
          updatedAt: reservation.updatedAt.toISOString()
        }))
      }
    });

  } catch (error) {
    console.error('Error retrieving reservations:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve reservations',
      data: null
    }, { status: 500 });
  }
}

// PUT - Update reservation status (admin only)
export async function PUT(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const body = await request.json();
    const { reservationId, status, adminKey, adminNotes } = body;
    
    // Simple admin authentication (in production, use proper authentication)
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
        data: null
      }, { status: 401 });
    }

    if (!['pending', 'confirmed', 'cancelled', 'modified'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, cancelled, or modified',
        data: null
      }, { status: 400 });
    }

    // Find and update reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return NextResponse.json({
        success: false,
        message: 'Reservation not found',
        data: null
      }, { status: 404 });
    }

    // Send appropriate emails based on status change
    if (status === 'confirmed') {
      // Send confirmation email to customer when admin approves
      sendReservationConfirmation(updatedReservation.toObject()).catch(error => {
        console.error('Failed to send confirmation email:', error);
      });
    } else if (status === 'cancelled') {
      // Send cancellation email to customer when admin rejects
      sendReservationStatusUpdate(
        updatedReservation.toObject(), 
        status, 
        adminNotes || 'Unfortunately, we cannot accommodate your reservation request.'
      ).catch(error => {
        console.error('Failed to send cancellation email:', error);
      });
    } else if (status === 'modified') {
      // Send modification email to customer
      sendReservationStatusUpdate(
        updatedReservation.toObject(), 
        status, 
        adminNotes || 'Your reservation has been modified.'
      ).catch(error => {
        console.error('Failed to send modification email:', error);
      });
    }

    const statusMessages = {
      confirmed: 'Reservation confirmed successfully! Customer has been sent a confirmation email.',
      cancelled: 'Reservation cancelled successfully. Customer has been notified.',
      modified: 'Reservation modified successfully. Customer has been notified.',
      pending: 'Reservation status updated successfully.'
    };

    return NextResponse.json({
      success: true,
      message: statusMessages[status] || `Reservation ${status} successfully.`,
      data: {
        reservation: {
          ...updatedReservation.toObject(),
          _id: updatedReservation._id.toString(),
          date: updatedReservation.date.toISOString().split('T')[0],
          createdAt: updatedReservation.createdAt.toISOString(),
          updatedAt: updatedReservation.updatedAt.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update reservation',
      data: null
    }, { status: 500 });
  }
}
