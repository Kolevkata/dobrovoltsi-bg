// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// Регистрация
router.post('/register', register);

// Вход
router.post('/login', login);

module.exports = router;