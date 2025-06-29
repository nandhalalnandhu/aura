const express = require('express');
const {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    searchDocuments
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, createDocument)
    .get(protect, getDocuments); // Get all accessible documents

router.get('/search', protect, searchDocuments);

router.route('/:id')
    .get(protect, getDocumentById)
    .put(protect, updateDocument)
    .delete(protect, deleteDocument);

module.exports = router;