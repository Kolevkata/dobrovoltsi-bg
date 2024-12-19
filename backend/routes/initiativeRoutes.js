// /backend/routes/initiativeRoutes.js
const express = require('express');
const router = express.Router();
const {
    createInitiative,
    getAllInitiatives,
    getInitiativeById,
    updateInitiative,
    deleteInitiative,
    approveInitiative
} = require('../controllers/initiativeController');
const { protect } = require('../middleware/auth');
const { authorize, isAdmin } = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { optionalAuth } = require('../middleware/optionalAuth');
const { addComment, getCommentsByInitiative } = require('../controllers/commentController'); // Добавено

// Публични маршрути за инициативи
router.get('/', optionalAuth, getAllInitiatives);
router.get('/:id', optionalAuth, getInitiativeById);

// Маршрути за коментари
router.post('/:initiativeId/comments', protect, authorize('volunteer', 'organizer', 'admin'), addComment);
router.get('/:initiativeId/comments', optionalAuth, getCommentsByInitiative);

// За създаване, редактиране и изтриване на инициативи
router.post('/', protect, authorize('organizer', 'admin'), upload.single('image'), createInitiative);
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('image'), updateInitiative);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteInitiative);
router.put('/:id/approve', protect, isAdmin, approveInitiative);

module.exports = router;