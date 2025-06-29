const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// This route will require authentication
router.post('/generate-content', protect, generateContent);

module.exports = router;