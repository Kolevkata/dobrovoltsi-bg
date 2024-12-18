// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { updateProfile, getUserProfile, changePassword, deleteAccount } = require('../controllers/userController');
const upload = require('../middleware/upload');

router.get('/me', protect, getUserProfile);
router.put('/me', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;