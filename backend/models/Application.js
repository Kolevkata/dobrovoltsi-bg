// /backend/models/Application.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Initiative = require('./Initiative');
const User = require('./User');

const Application = sequelize.define('Application', {
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
    },
    volunteerId: {
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
}, {});

Application.belongsTo(Initiative, { foreignKey: 'initiativeId', as: 'initiative' });
Application.belongsTo(User, { foreignKey: 'volunteerId', as: 'volunteer' });

module.exports = Application;