// /middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.protect = async(req, res, next) => {
    let token;

    // Проверка за токен в заглавките
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ msg: 'Неоторизиран достъп, липсва токен' });
    }

    try {
        // Декодиране на токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Намиране на потребителя по ID
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: 'Неоторизиран достъп, потребителят не е намерен' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Неоторизиран достъп, невалиден токен' });
    }
};