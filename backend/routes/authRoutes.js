// /routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile, refreshToken, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Registration
router.post('/register', register);

// Login
router.post('/login', login);

// Refresh Access Token
router.post('/refresh-token', refreshToken);

// Logout
router.post('/logout', logout);

// Get User Profile (Protected Route)
router.get('/profile', protect, getProfile);

module.exports = router;