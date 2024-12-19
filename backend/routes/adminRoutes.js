// /backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const { adminGetAllUsers, adminDeleteUser, adminGetUserProfile } = require('../controllers/userController');
const { getUnapprovedInitiatives } = require('../controllers/initiativeController');
const { getAdminMetrics } = require('../controllers/adminController'); // Import the new controller

router.get('/users', protect, isAdmin, adminGetAllUsers);
router.get('/users/:userId', protect, isAdmin, adminGetUserProfile);
router.delete('/users/:userId', protect, isAdmin, adminDeleteUser);

router.get('/initiatives/unapproved', protect, isAdmin, getUnapprovedInitiatives);

router.get('/metrics', protect, isAdmin, getAdminMetrics);

module.exports = router;