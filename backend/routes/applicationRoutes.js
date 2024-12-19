// /backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const {
    applyToInitiative,
    getApplicationsByInitiative,
    updateApplicationStatus,
    getUserApplications,
    getApplicationsForOrganizer,
    deleteApplication
} = require('../controllers/applicationController.js');
const { protect } = require('../middleware/auth');
const { authorize, isAdmin } = require('../middleware/authorize');

// Кандидатстване за инициатива (само за доброволци)
router.post('/', protect, authorize('volunteer'), applyToInitiative);

// Получаване на всички кандидатури за инициатива (само за организатори и admin)
router.get('/initiative/:initiativeId', protect, authorize('organizer', 'admin'), getApplicationsByInitiative);

// Актуализиране на статус на кандидатура (само за организатори и admin)
router.put('/:applicationId', protect, authorize('organizer', 'admin'), updateApplicationStatus);

// Получаване на всички кандидатури на текущия доброволец
router.get('/user', protect, authorize('volunteer'), getUserApplications);

// Получаване на всички кандидатури за инициативите на текущия организатор
router.get('/organizer', protect, authorize('organizer', 'admin'), getApplicationsForOrganizer);

// Изтриване на кандидатура (само за доброволец, който е създал, или admin)
router.delete('/:applicationId', protect, authorize('volunteer', 'admin'), deleteApplication);

module.exports = router;