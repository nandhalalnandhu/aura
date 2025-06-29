const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' }, // HTML content from WYSIWYG editor
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    visibility: { type: String, enum: ['public', 'private', 'shared'], default: 'private' },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users with explicit read access
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Document', documentSchema);