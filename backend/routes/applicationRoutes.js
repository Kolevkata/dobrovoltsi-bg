// /backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const {
    applyToInitiative,
    getApplicationsByInitiative,
    updateApplicationStatus,
    getUserApplications,
    getApplicationsForOrganizer
} = require('../controllers/applicationController.js');
const { protect } = require('../middleware/auth');

// Кандидатстване за инициатива (само за доброволци)
router.post('/', protect, applyToInitiative);

// Получаване на всички кандидатури за инициатива (само за организатори)
router.get('/initiative/:initiativeId', protect, getApplicationsByInitiative);

// Актуализиране на статус на кандидатура (само за организатори)
router.put('/:applicationId', protect, updateApplicationStatus);

// Получаване на всички кандидатури на текущия доброволец
router.get('/user', protect, getUserApplications);

// Получаване на всички кандидатури за инициативите на текущия организатор
router.get('/organizer', protect, getApplicationsForOrganizer);

module.exports = router;