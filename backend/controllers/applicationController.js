// /controllers/applicationController.js
const Application = require('../models/Application');
const Initiative = require('../models/Initiative');
const User = require('../models/User');

// Кандидатстване за инициатива
exports.applyToInitiative = async(req, res) => {
    const { initiativeId } = req.body;
    const volunteerId = req.user.id;

    try {
        const initiative = await Initiative.findByPk(initiativeId);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }

        // Проверка дали вече е кандидатствал
        const existingApplication = await Application.findOne({
            where: { initiativeId, volunteerId },
        });
        if (existingApplication) {
            return res.status(400).json({ msg: 'Вече сте кандидатствали за тази инициатива' });
        }

        const application = await Application.create({
            initiativeId,
            volunteerId,
        });

        res.status(201).json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Получаване на всички кандидатури за инициатива (само за организаторите и admin)
exports.getApplicationsByInitiative = async(req, res) => {
    const { initiativeId } = req.params;

    try {
        const initiative = await Initiative.findByPk(initiativeId);
        if (!initiative) {
            return res.status(404).json({ msg: 'Иницииативата не е намерена' });
        }

        // Проверка дали потребителят е организатор или admin
        if (initiative.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        const applications = await Application.findAll({
            where: { initiativeId },
            include: [{ model: User, as: 'volunteer', attributes: ['id', 'name', 'email'] }],
        });

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Актуализиране на статус на кандидатура
exports.updateApplicationStatus = async(req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    try {
        const application = await Application.findByPk(applicationId, {
            include: [{ model: Initiative, as: 'initiative' }],
        });

        if (!application) {
            return res.status(404).json({ msg: 'Кандидатурата не е намерена' });
        }

        // Проверка дали потребителят е организатор или admin
        if (application.initiative.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Неоторизиран достъп' });
        }

        if (status && ['Approved', 'Denied'].includes(status)) {
            application.status = status;
            await application.save();
            res.json(application);
        } else {
            res.status(400).json({ msg: 'Невалиден статус' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Получаване на всички кандидатури на текущия доброволец
exports.getUserApplications = async(req, res) => {
    const volunteerId = req.user.id;

    try {
        const applications = await Application.findAll({
            where: { volunteerId },
            include: [{
                model: Initiative,
                as: 'initiative',
                attributes: ['id', 'title', 'description', 'date', 'category', 'imageUrl']
            }],
        });

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Получаване на всички кандидатури за инициативите на текущия организатор
exports.getApplicationsForOrganizer = async(req, res) => {
    const organizerId = req.user.id;

    try {
        const initiatives = await Initiative.findAll({
            where: { organizerId },
            attributes: ['id'],
        });

        const initiativeIds = initiatives.map(initiative => initiative.id);

        const applications = await Application.findAll({
            where: { initiativeId: initiativeIds },
            include: [{
                model: User,
                as: 'volunteer',
                attributes: ['id', 'name', 'email']
            }, {
                model: Initiative,
                as: 'initiative',
                attributes: ['id', 'title']
            }],
        });

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};

// Добавено: Изтриване на кандидатура
exports.deleteApplication = async(req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await Application.findByPk(applicationId, {
            include: [{ model: Initiative, as: 'initiative' }],
        });

        if (!application) {
            return res.status(404).json({ msg: 'Кандидатурата не е намерена' });
        }

        // Проверка дали потребителят е доброволецът, който е създал кандидатурата или е admin
        if (application.volunteerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Неоторизиран достъп' });
        }

        await application.destroy();
        res.json({ msg: 'Кандидатурата е изтрита успешно' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра');
    }
};