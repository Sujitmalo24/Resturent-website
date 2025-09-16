import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^\+?[\d\s\-\(\)]{10,}$/,
      'Please provide a valid phone number'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters'],
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  contactReason: {
    type: String,
    required: [true, 'Contact reason is required'],
    enum: {
      values: ['general', 'reservation', 'events', 'catering', 'feedback', 'complaint', 'employment', 'other'],
      message: 'Invalid contact reason'
    }
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'resolved'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  respondedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-set priority based on contact reason
ContactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set priority based on contact reason
  if (this.isNew) {
    switch (this.contactReason) {
      case 'complaint':
        this.priority = 'high';
        break;
      case 'reservation':
      case 'events':
        this.priority = 'medium';
        break;
      case 'employment':
      case 'catering':
        this.priority = 'medium';
        break;
      default:
        this.priority = 'low';
    }
  }
  
  next();
});

// Prevent duplicate model compilation in development
const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact;
