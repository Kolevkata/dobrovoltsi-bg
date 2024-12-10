// /controllers/authController.js
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Helper function to generate access tokens
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Helper function to generate refresh tokens
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

// Registration of user
exports.register = async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'Потребителят вече съществува' });
        }

        // Create new user
        user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token in the database
        await Token.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// User login
exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find user with password
        const user = await User.scope('withPassword').findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Невалидни креденциали' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Невалидни креденциали' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token in the database
        await Token.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Get user profile
exports.getProfile = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Потребителят не е намерен' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Refresh access token
exports.refreshToken = async(req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ msg: 'Липсва refresh token' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if refresh token exists in the database
        const storedToken = await Token.findOne({ where: { token: refreshToken, userId: decoded.id } });
        if (!storedToken) {
            return res.status(401).json({ msg: 'Неоторизиран достъп, невалиден refresh token' });
        }

        // Check if refresh token is expired
        if (storedToken.expiresAt < new Date()) {
            await storedToken.destroy(); // Remove expired token
            return res.status(401).json({ msg: 'Refresh token е изтекъл' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(decoded.id);

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Неоторизиран достъп, невалиден refresh token' });
    }
};

// Logout user (revoke refresh token)
exports.logout = async(req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ msg: 'Липсва refresh token' });
    }

    try {
        // Find and delete the refresh token from the database
        const token = await Token.findOne({ where: { token: refreshToken } });
        if (token) {
            await token.destroy();
            return res.json({ msg: 'Успешен изход' });
        } else {
            return res.status(400).json({ msg: 'Невалиден refresh token' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};