// /controllers/commentController.js
const Comment = require('../models/Comment');
const Initiative = require('../models/Initiative');
const User = require('../models/User');

// Добавяне на коментар към инициатива
exports.addComment = async(req, res) => {
    const { content } = req.body;
    const initiativeId = req.params.initiativeId;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
        return res.status(400).json({ msg: 'Съдържанието на коментара не може да бъде празно.' });
    }

    try {
        const initiative = await Initiative.findByPk(initiativeId);
        if (!initiative) {
            return res.status(404).json({ msg: 'Инициативата не е намерена.' });
        }

        const comment = await Comment.create({
            content,
            initiativeId,
            userId,
        });

        const commentWithUser = await Comment.findByPk(comment.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        });

        res.status(201).json(commentWithUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра.');
    }
};

// Получаване на всички коментари за инициатива
exports.getCommentsByInitiative = async(req, res) => {
    const initiativeId = req.params.initiativeId;

    try {
        const initiative = await Initiative.findByPk(initiativeId);
        if (!initiative) {
            return res.status(404).json({ msg: 'Инициативата не е намерена.' });
        }

        const comments = await Comment.findAll({
            where: { initiativeId },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
            order: [
                ['createdAt', 'ASC']
            ],
        });

        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра.');
    }
};

// Изтриване на коментар (само от създателя или admin)
exports.deleteComment = async(req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findByPk(id, {
            include: [{ model: Initiative, as: 'initiative' }],
        });

        if (!comment) {
            return res.status(404).json({ msg: 'Коментираното не е намерено.' });
        }

        // Проверка дали потребителят е създателят на коментара или admin
        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Неоторизиран достъп.' });
        }

        await comment.destroy();

        res.json({ msg: 'Коментарът е изтрит успешно.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Грешка в сървъра.');
    }
};