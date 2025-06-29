// server/routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get all users (e.g., for @mentions autocomplete)
router.get('/', protect, getAllUsers);

// Route to get the currently authenticated user's profile
router.get('/profile', protect, getUserProfile);

module.exports = router;