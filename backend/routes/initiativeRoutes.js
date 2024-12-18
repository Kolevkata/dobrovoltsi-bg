// /routes/initiativeRoutes.js
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

// Use optionalAuth for public endpoint, so it can detect logged-in organizers/admins
router.get('/', optionalAuth, getAllInitiatives);
router.get('/:id', optionalAuth, getInitiativeById);

router.post('/', protect, authorize('organizer', 'admin'), upload.single('image'), createInitiative);
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('image'), updateInitiative);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteInitiative);
router.put('/:id/approve', protect, isAdmin, approveInitiative);

module.exports = router;