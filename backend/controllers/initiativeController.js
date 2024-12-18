// /controllers/initiativeController.js
const Initiative = require('../models/Initiative');
const User = require('../models/User');
const { Op } = require('sequelize');

function getFullImageUrl(req, relativePath) {
    if (!relativePath) return null;
    return `${req.protocol}://${req.get('host')}${relativePath}`;
}

exports.createInitiative = async(req, res) => {
    const { title, description, location, date, category } = req.body;
    const organizerId = req.user.id;
    let imageUrl = null;
    if (req.file) {
        imageUrl = '/uploads/' + req.file.filename;
    }

    try {
        const initiative = await Initiative.create({
            title,
            description,
            location,
            date,
            category,
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
                // Admin sees all initiatives
                whereCondition = {};
            } else if (req.user.role === 'organizer') {
                // Organizer sees all approved + their own (even if not approved)
                whereCondition = {
                    [Op.or]: [
                        { approved: true },
                        { organizerId: req.user.id }
                    ]
                };
            } else {
                // Volunteers or other roles see only approved
                whereCondition.approved = true;
            }
        } else {
            // Unauthenticated users see only approved
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
        if (!initiative || (!initiative.approved && (!req.user || req.user.role !== 'admin'))) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена или не е одобрена' });
        }
        res.json({
            ...initiative.get(),
            imageUrl: getFullImageUrl(req, initiative.imageUrl)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.updateInitiative = async(req, res) => {
    const { id } = req.params;
    const { title, description, location, date, category } = req.body;

    try {
        let initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }

        if (initiative.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        if (req.file) {
            initiative.imageUrl = '/uploads/' + req.file.filename;
        }

        initiative.title = title || initiative.title;
        initiative.description = description || initiative.description;
        initiative.location = location || initiative.location;
        initiative.date = date || initiative.date;
        initiative.category = category || initiative.category;

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
        let initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }

        if (initiative.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        await initiative.destroy();
        res.json({ msg: 'Иницииативата е изтрита' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

exports.approveInitiative = async(req, res) => {
    const { id } = req.params;
    try {
        const initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }
        initiative.approved = true;
        await initiative.save();
        res.json({ msg: 'Иницииативата е одобрена', initiative });
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