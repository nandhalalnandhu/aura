// server/controllers/userController.js
const User = require('../models/User');

// @desc    Get all users (for mentions, sharing)
// @route   GET /api/users
// @access  Private (only logged in users can see other users)
const getAllUsers = async (req, res) => {
    try {
        // Exclude sensitive information like password, and optionally email if not needed
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password -email');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// @desc    Get user profile (of the authenticated user)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // req.user is populated by the protect middleware
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        // Add other profile fields if your User model has them
    });
};

// You could add other functions here like:
// - updateUserProfile
// - changePassword
// - getUserById (for fetching a specific user's public info)

module.exports = {
    getAllUsers,
    getUserProfile,
};