// Server-side validation utilities for restaurant reservations

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Remove common phone formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  // Check for international format or US format
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(cleanPhone);
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date instanceof Date && !isNaN(date) && date >= today;
};

export const validateTime = (timeString) => {
  const validTimes = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];
  return validTimes.includes(timeString);
};

export const validateGuests = (guests) => {
  const guestCount = parseInt(guests);
  return !isNaN(guestCount) && guestCount >= 1 && guestCount <= 20;
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

export const validateReservationData = (data) => {
  const errors = {};

  // Name validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Date is required';
  } else if (!validateDate(data.date)) {
    errors.date = 'Please select a valid future date';
  }

  // Time validation
  if (!data.time) {
    errors.time = 'Time is required';
  } else if (!validateTime(data.time)) {
    errors.time = 'Please select a valid time slot';
  }

  // Guests validation
  if (!data.guests) {
    errors.guests = 'Number of guests is required';
  } else if (!validateGuests(data.guests)) {
    errors.guests = 'Number of guests must be between 1 and 20';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      firstName: sanitizeString(data.firstName),
      lastName: sanitizeString(data.lastName),
      email: data.email?.trim().toLowerCase(),
      phone: sanitizeString(data.phone),
      date: data.date,
      time: data.time,
      guests: parseInt(data.guests),
      occasion: sanitizeString(data.occasion || ''),
      specialRequests: sanitizeString(data.specialRequests || '')
    }
  };
};

// Business hours validation
export const isWithinBusinessHours = (dateString, timeString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if restaurant is open on this day
  if (dayOfWeek === 0 && timeString < '4:00 PM') {
    return false; // Sunday opens at 4 PM
  }
  
  if (dayOfWeek === 1) {
    return false; // Closed on Mondays
  }
  
  // Check time ranges
  const timeRanges = {
    1: [], // Monday - Closed
    2: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'], // Tuesday
    3: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'], // Wednesday
    4: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'], // Thursday
    5: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM'], // Friday
    6: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM'], // Saturday
    0: ['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'] // Sunday
  };
  
  return timeRanges[dayOfWeek]?.includes(timeString) || false;
};

const validationUtils = {
  validateEmail,
  validatePhone,
  validateDate,
  validateTime,
  validateGuests,
  sanitizeString,
  validateReservationData,
  isWithinBusinessHours
};

export default validationUtils;
