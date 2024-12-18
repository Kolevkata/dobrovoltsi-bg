// /controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

function getFullImageUrl(req, relativePath) {
    if (!relativePath) return null;
    return `${req.protocol}://${req.get('host')}${relativePath}`;
}

exports.getUserProfile = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Потребителят не е намерен' });

        const profileImage = getFullImageUrl(req, user.profileImage);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.updateProfile = async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Потребителят не е намерен' });

        if (req.file) {
            user.profileImage = '/uploads/' + req.file.filename;
        }
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();

        const profileImage = getFullImageUrl(req, user.profileImage);

        res.json({
            msg: 'Профилът е актуализиран',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.changePassword = async(req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.scope('withPassword').findByPk(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Потребителят не е намерен' });

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(400).json({ msg: 'Грешна текуща парола' });

        user.password = newPassword;
        await user.save();
        res.json({ msg: 'Паролата е сменена успешно' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.deleteAccount = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Потребителят не е намерен' });
        await user.destroy();
        res.json({ msg: 'Профилът е изтрит' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

// Admin functions
exports.adminGetAllUsers = async(req, res) => {
    try {
        const users = await User.findAll();
        const result = users.map(u => {
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                profileImage: u.profileImage ? `${req.protocol}://${req.get('host')}${u.profileImage}` : null
            };
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.adminDeleteUser = async(req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ msg: 'Потребителят не е намерен' });
        await user.destroy();
        res.json({ msg: 'Потребителят е изтрит' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.adminGetUserProfile = async(req, res) => {
    const { userId } = req.params;
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
        return res.status(400).json({ msg: 'Невалиден потребител ID' });
    }
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ msg: 'Потребителят не е намерен' });
        const profileImage = user.profileImage ? `${req.protocol}://${req.get('host')}${user.profileImage}` : null;
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};