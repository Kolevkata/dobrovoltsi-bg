// /routes/initiativeRoutes.js
const express = require('express');
const router = express.Router();
const {
    createInitiative,
    getAllInitiatives,
    getInitiativeById,
    updateInitiative,
    deleteInitiative
} = require('../controllers/initiativeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// Създаване на инициатива (само за организатори)
router.post('/', protect, authorize('organizer'), createInitiative);

// Получаване на всички инициативи
router.get('/', getAllInitiatives);

// Получаване на инициатива по ID
router.get('/:id', getInitiativeById);

// Актуализиране на инициатива (само за организатори)
router.put('/:id', protect, authorize('organizer'), updateInitiative);

// Изтриване на инициатива (само за организатори)
router.delete('/:id', protect, authorize('organizer'), deleteInitiative);

module.exports = router;