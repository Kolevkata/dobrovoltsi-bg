// /controllers/authController.js
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

function getFullImageUrl(req, relativePath) {
    if (!relativePath) return null;
    return `${req.protocol}://${req.get('host')}${relativePath}`;
}

exports.register = async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'Потребителят вече съществува' });
        }

        user = await User.create({
            name,
            email,
            password,
            role,
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await Token.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const profileImage = getFullImageUrl(req, user.profileImage);

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.scope('withPassword').findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Невалидни креденциали' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Невалидни креденциали' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await Token.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const profileImage = getFullImageUrl(req, user.profileImage);

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.getProfile = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Потребителят не е намерен' });
        }
        const profileImage = getFullImageUrl(req, user.profileImage);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.refreshToken = async(req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ msg: 'Липсва refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const storedToken = await Token.findOne({ where: { token: refreshToken, userId: decoded.id } });
        if (!storedToken) {
            return res.status(401).json({ msg: 'Неоторизиран достъп, невалиден refresh token' });
        }

        if (storedToken.expiresAt < new Date()) {
            await storedToken.destroy();
            return res.status(401).json({ msg: 'Refresh token е изтекъл' });
        }

        await storedToken.destroy();

        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        await Token.create({
            token: newRefreshToken,
            userId: decoded.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Неоторизиран достъп, невалиден refresh token' });
    }
};

exports.logout = async(req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ msg: 'Липсва refresh token' });
    }

    try {
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