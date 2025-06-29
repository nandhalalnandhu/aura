const express = require('express');
const { getMyNotifications, markNotificationAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markNotificationAsRead);

module.exports = router;