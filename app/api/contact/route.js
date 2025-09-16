import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';
import Contact from '../../../models/Contact.js';
import { sendContactNotification, sendContactConfirmation } from '../../../lib/email.js';

// Server-side validation for contact form
const validateContactData = (data) => {
  const errors = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional)
  if (data.phone?.trim()) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  // Subject validation
  if (!data.subject?.trim()) {
    errors.subject = 'Subject is required';
  } else if (data.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters';
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 1000) {
    errors.message = 'Message must be less than 1000 characters';
  }

  // Contact reason validation
  const validReasons = ['general', 'reservation', 'events', 'catering', 'feedback', 'complaint', 'employment', 'other'];
  if (!validReasons.includes(data.contactReason)) {
    errors.contactReason = 'Invalid contact reason';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Get client IP address
const getClientIP = (request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
};

// POST - Create new contact message
export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const body = await request.json();
    
    // Validate input data
    const validation = validateContactData(body);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        data: validation.errors
      }, { status: 400 });
    }

    // Prepare contact data
    const contactData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      subject: body.subject.trim(),
      message: body.message.trim(),
      contactReason: body.contactReason,
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Create and save contact
    const newContact = new Contact(contactData);
    const savedContact = await newContact.save();

    // Send notification email to admin (async, don't wait)
    sendContactNotification(savedContact.toObject()).catch(error => {
      console.error('Failed to send admin notification:', error);
    });

    // Send confirmation email to customer (async, don't wait)
    sendContactConfirmation(savedContact.toObject()).catch(error => {
      console.error('Failed to send customer confirmation:', error);
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        contactId: savedContact._id,
        submittedAt: savedContact.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating contact:', error);
    
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

// GET - Retrieve contact messages (admin only)
export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const reason = searchParams.get('reason');
    const adminKey = searchParams.get('adminKey');
    
    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
        data: null
      }, { status: 401 });
    }

    // Build query filters
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (reason) filters.contactReason = reason;

    // Fetch contacts from MongoDB
    const contacts = await Contact.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Contact messages retrieved successfully',
      data: {
        contacts: contacts.map(contact => ({
          ...contact,
          _id: contact._id.toString(),
          createdAt: contact.createdAt.toISOString(),
          updatedAt: contact.updatedAt.toISOString(),
          respondedAt: contact.respondedAt ? contact.respondedAt.toISOString() : null
        }))
      }
    });

  } catch (error) {
    console.error('Error retrieving contacts:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve contact messages',
      data: null
    }, { status: 500 });
  }
}

// PUT - Update contact status/notes (admin only)
export async function PUT(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const body = await request.json();
    const { contactId, status, priority, adminNotes, adminKey } = body;
    
    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
        data: null
      }, { status: 401 });
    }

    if (!contactId) {
      return NextResponse.json({
        success: false,
        message: 'Contact ID is required',
        data: null
      }, { status: 400 });
    }

    // Prepare update data
    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'responded') updateData.respondedAt = new Date();

    // Find and update contact
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return NextResponse.json({
        success: false,
        message: 'Contact message not found',
        data: null
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message updated successfully',
      data: {
        contact: {
          ...updatedContact.toObject(),
          _id: updatedContact._id.toString(),
          createdAt: updatedContact.createdAt.toISOString(),
          updatedAt: updatedContact.updatedAt.toISOString(),
          respondedAt: updatedContact.respondedAt ? updatedContact.respondedAt.toISOString() : null
        }
      }
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update contact message',
      data: null
    }, { status: 500 });
  }
}
