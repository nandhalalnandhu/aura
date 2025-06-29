const Notification = require('../models/Notification');

// Get notifications for the authenticated user
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'username')
            .populate('document', 'title')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (!notification.recipient.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to modify this notification' });
        }
        notification.read = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyNotifications, markNotificationAsRead };