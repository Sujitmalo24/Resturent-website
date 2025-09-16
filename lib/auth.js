import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 7 days

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'restaurant-app'
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Create admin session data
export const createAdminSession = (admin) => {
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

// Middleware to verify admin token from request
export const verifyAdminToken = (request) => {
  try {
    // Check for token in Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    return decoded;
  } catch (error) {
    throw new Error('Unauthorized access');
  }
};

// Extract token from cookies (alternative method)
export const getTokenFromCookies = (request) => {
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

const authUtils = {
  generateToken,
  verifyToken,
  createAdminSession,
  verifyAdminToken,
  getTokenFromCookies
};

export default authUtils;
