// /models/Application.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Initiative = require('./Initiative');

const Application = sequelize.define('Application', {
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending', // Статус на кандидатурата
    },
}, {
    // Допълнителни настройки
});

// Връзка с потребителя (доброволец)
User.hasMany(Application, { foreignKey: 'volunteerId' });
Application.belongsTo(User, { foreignKey: 'volunteerId', as: 'volunteer' });

// Връзка с инициатива
Initiative.hasMany(Application, { foreignKey: 'initiativeId' });
Application.belongsTo(Initiative, { foreignKey: 'initiativeId', as: 'initiative' });

module.exports = Application;