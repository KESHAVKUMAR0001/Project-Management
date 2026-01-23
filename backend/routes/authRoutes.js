/**
 * Auth Routes (routes/authRoutes.js)
 * 
 * WHAT IT DOES:
 * Maps HTTP URL endpoints for authentication to their controller functions.
 * 
 * WHY IT IS NEEDED:
 * Express router separates endpoints into logical modules.
 */

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
