// /controllers/initiativeController.js
const Initiative = require('../models/Initiative');
const User = require('../models/User');
const { Op } = require('sequelize');

function getFullImageUrl(req, relativePath) {
    if (!relativePath) return null;
    return `${req.protocol}://${req.get('host')}${relativePath}`;
}

exports.createInitiative = async(req, res) => {
    const { title, description, date, category, address, latitude, longitude } = req.body;
    const organizerId = req.user.id;
    let imageUrl = null;
    if (req.file) {
        imageUrl = '/uploads/' + req.file.filename;
    }

    try {
        const initiative = await Initiative.create({
            title,
            description,
            date,
            category,
            address,
            latitude,
            longitude,
            imageUrl,
            organizerId,
            approved: false,
        });
        res.status(201).json({
            ...initiative.get(),
            imageUrl: getFullImageUrl(req, initiative.imageUrl)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.getAllInitiatives = async(req, res) => {
    try {
        let whereCondition = {};
        if (req.user) {
            if (req.user.role === 'admin') {
                // Admin вижда всички инициативи
                whereCondition = {};
            } else if (req.user.role === 'organizer') {
                // Организатор вижда всички одобрени + собствените си (дори и не одобрени)
                whereCondition = {
                    [Op.or]: [
                        { approved: true },
                        { organizerId: req.user.id }
                    ]
                };
            } else {
                // Доброволци или други роли виждат само одобрени
                whereCondition.approved = true;
            }
        } else {
            // Неаутентифицирани потребители виждат само одобрени
            whereCondition.approved = true;
        }

        const initiatives = await Initiative.findAll({
            where: whereCondition,
            include: [{ model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }],
        });

        const result = initiatives.map(i => ({
            ...i.get(),
            imageUrl: getFullImageUrl(req, i.imageUrl)
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.getInitiativeById = async(req, res) => {
    const { id } = req.params;
    try {
        const initiative = await Initiative.findByPk(id, {
            include: [{ model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }],
        });

        if (!initiative) {
            console.log(`Инициативата с ID=${id} не е намерена.`);
            return res.status(404).json({ msg: 'Инициативата не е намерена.' });
        }

        const isAdmin = req.user && req.user.role === 'admin';
        const isOrganizer = req.user && req.user.id === initiative.organizerId;

        if (!initiative.approved && !isAdmin && !isOrganizer) {
            console.log(`Потребителят с ID=${req.user ? req.user.id : 'N/A'} няма права да вижда неодобрена инициатива с ID=${id}.`);
            return res.status(404).json({ msg: 'Инициативата не е одобрена или не е намерена.' });
        }

        res.json({
            ...initiative.get(),
            imageUrl: getFullImageUrl(req, initiative.imageUrl)
        });
    } catch (err) {
        console.error(`Грешка при получаване на инициатива с ID=${id}:`, err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.updateInitiative = async(req, res) => {
    const { id } = req.params;
    const { title, description, date, category, address, latitude, longitude } = req.body;

    try {
        let initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Инициативата не е намерена' });
        }

        if (initiative.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        if (req.file) {
            initiative.imageUrl = '/uploads/' + req.file.filename;
        }

        initiative.title = title || initiative.title;
        initiative.description = description || initiative.description;
        initiative.date = date || initiative.date;
        initiative.category = category || initiative.category;
        initiative.address = address || initiative.address;
        initiative.latitude = latitude || initiative.latitude;
        initiative.longitude = longitude || initiative.longitude;

        await initiative.save();
        res.json({
            ...initiative.get(),
            imageUrl: getFullImageUrl(req, initiative.imageUrl)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.deleteInitiative = async(req, res) => {
    const { id } = req.params;
    try {
        const initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Инициативата не е намерена.' });
        }

        // Проверка дали потребителят е организатор или admin
        if (initiative.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        await initiative.destroy(); // Това автоматично изтрива свързаните кандидатури благодарение на CASCADE
        res.json({ msg: 'Инициативата е изтрита успешно.' });
    } catch (err) {
        console.error('Error deleting initiative:', err);
        res.status(500).json({ msg: 'Грешка при изтриване на инициативата.' });
    }
};

exports.approveInitiative = async(req, res) => {
    const { id } = req.params;
    try {
        const initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Инициативата не е намерена' });
        }
        initiative.approved = true;
        await initiative.save();
        res.json({ msg: 'Инициативата е одобрена', initiative });
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.getUnapprovedInitiatives = async(req, res) => {
    try {
        const unapprovedInitiatives = await Initiative.findAll({
            where: { approved: false },
            include: [{ model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }],
        });

        const result = unapprovedInitiatives.map(i => ({
            ...i.get(),
            imageUrl: getFullImageUrl(req, i.imageUrl)
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Грешка в сървъра');
    }
};