const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, who triggered the mention
    type: { type: String, enum: ['mention', 'document_share'], required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Notification', notificationSchema);