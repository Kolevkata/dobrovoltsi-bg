// /controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация на потребител
exports.register = async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Проверка дали потребителят съществува
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'Потребителят вече съществува' });
        }

        // Създаване на нов потребител
        user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role,
        });

        // Създаване на токен
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Вход на потребител
exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Намиране на потребителя
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Невалидни креденциали' });
        }

        // Проверка на паролата
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Невалидни креденциали' });
        }

        // Създаване на токен
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};