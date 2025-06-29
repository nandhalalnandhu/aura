const Document = require('../models/Document');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create Document
const createDocument = async (req, res) => {
    const { title, content, visibility } = req.body;
    try {
        const document = await Document.create({
            title,
            content,
            author: req.user._id, // Set author from authenticated user
            visibility,
        });
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Accessible Documents (Document Listing)
const getDocuments = async (req, res) => {
    try {
        // Find documents that are public, or authored by the user, or shared with the user
        const documents = await Document.find({
            $or: [
                { visibility: 'public' },
                { author: req.user._id },
                { sharedWith: req.user._id }
            ]
        })
        .populate('author', 'username email') // Populate author details
        .populate('lastModifiedBy', 'username email')
        .sort({ updatedAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Document
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('author', 'username email')
            .populate('lastModifiedBy', 'username email')
            .populate('sharedWith', 'username email');

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check access permissions
        const hasAccess = document.visibility === 'public' ||
                          document.author.equals(req.user._id) ||
                          document.sharedWith.some(user => user._id.equals(req.user._id));

        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Document (In-place editing with auto-save)
const updateDocument = async (req, res) => {
    const { title, content, visibility } = req.body;
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Only author or sharedWith user with edit permission (if you implement roles) can edit
        // For simplicity, let's allow author to edit and anyone with shared access can suggest edits (or just view for now)
        if (!document.author.equals(req.user._id) && !document.sharedWith.some(user => user._id.equals(req.user._id))) {
            return res.status(403).json({ message: 'Not authorized to edit this document' });
        }

        document.title = title || document.title;
        document.content = content || document.content;
        document.visibility = visibility || document.visibility;
        document.lastModifiedBy = req.user._id;
        document.updatedAt = Date.now();

        const updatedDocument = await document.save();

        // Handle User Mentions (@username functionality) and Auto-sharing
        const mentionedUsernames = content.match(/@(\w+)/g) || [];
        for (const mention of mentionedUsernames) {
            const username = mention.substring(1); // Remove '@'
            const mentionedUser = await User.findOne({ username });

            if (mentionedUser && !updatedDocument.sharedWith.includes(mentionedUser._id) && !mentionedUser._id.equals(updatedDocument.author)) {
                updatedDocument.sharedWith.push(mentionedUser._id);
                await updatedDocument.save();

                // Create a notification for the mentioned user
                await Notification.create({
                    recipient: mentionedUser._id,
                    sender: req.user._id,
                    type: 'mention',
                    document: updatedDocument._id,
                    message: `${req.user.username} mentioned you in "${updatedDocument.title}"`,
                });
            }
        }

        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Document
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Only author can delete
        if (!document.author.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this document' });
        }

        await Document.deleteOne({ _id: req.params.id });
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search Functionality
const searchDocuments = async (req, res) => {
    const { query } = req.query;
    try {
        const documents = await Document.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search for title
                        { content: { $regex: query, $options: 'i' } } // Case-insensitive search for content
                    ]
                },
                {
                    $or: [
                        { visibility: 'public' },
                        { author: req.user._id },
                        { sharedWith: req.user._id }
                    ]
                }
            ]
        })
        .populate('author', 'username email')
        .populate('lastModifiedBy', 'username email')
        .sort({ updatedAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    searchDocuments,
};