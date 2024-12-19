// /routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// Изтриване на коментар
router.delete('/:id', protect, authorize('volunteer', 'admin'), deleteComment);

module.exports = router;