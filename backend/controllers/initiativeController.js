// /controllers/initiativeController.js
const Initiative = require('../models/Initiative');
const User = require('../models/User');

// Създаване на инициатива
exports.createInitiative = async(req, res) => {
    const { title, description, location, date, category, imageUrl } = req.body;
    const organizerId = req.user.id; // От JWT

    try {
        const initiative = await Initiative.create({
            title,
            description,
            location,
            date,
            category,
            imageUrl,
            organizerId,
        });
        res.status(201).json(initiative);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Получаване на всички инициативи
exports.getAllInitiatives = async(req, res) => {
    try {
        const initiatives = await Initiative.findAll({
            include: [{ model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }],
        });
        res.json(initiatives);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Получаване на инициатива по ID
exports.getInitiativeById = async(req, res) => {
    const { id } = req.params;
    try {
        const initiative = await Initiative.findByPk(id, {
            include: [{ model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }],
        });
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }
        res.json(initiative);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Актуализиране на инициатива
exports.updateInitiative = async(req, res) => {
    const { id } = req.params;
    const { title, description, location, date, category, imageUrl } = req.body;

    try {
        let initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }

        // Проверка дали потребителят е организатор
        if (initiative.organizerId !== req.user.id) {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        initiative.title = title || initiative.title;
        initiative.description = description || initiative.description;
        initiative.location = location || initiative.location;
        initiative.date = date || initiative.date;
        initiative.category = category || initiative.category;
        initiative.imageUrl = imageUrl || initiative.imageUrl;

        await initiative.save();
        res.json(initiative);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Изтриване на инициатива
exports.deleteInitiative = async(req, res) => {
    const { id } = req.params;

    try {
        let initiative = await Initiative.findByPk(id);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }

        // Проверка дали потребителят е организатор
        if (initiative.organizerId !== req.user.id) {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        await initiative.destroy();
        res.json({ msg: 'Иницииативата е изтрита' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};