// /backend/models/Comment.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Initiative = require('./Initiative');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    initiativeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Initiative,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    // Допълнителни настройки, ако е необходимо
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Initiative, { foreignKey: 'initiativeId', as: 'initiative' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Initiative.hasMany(Comment, { foreignKey: 'initiativeId', as: 'comments' });

module.exports = Comment;