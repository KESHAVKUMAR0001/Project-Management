/**
 * Auth Middleware (middleware/authMiddleware.js)
 * 
 * 1. protect: Verifies Bearer JWT Access Token and sets req.user.
 * 2. authorize: Checks if req.user.role matches allowed roles ('user' or 'admin').
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'User role not authorized' });
    }
    next();
  };
};

module.exports = { protect, authorize };
