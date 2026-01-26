/**
 * User Routes (routes/userRoutes.js)
 * 
 * WHAT IT DOES:
 * Routes for user listing and profile management.
 * 
 * WHY IT IS NEEDED:
 * Protects user routes so only logged-in users can list team members or update profile.
 */

const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All user routes require authentication

router.get('/', getUsers);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;
