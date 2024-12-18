// /models/Initiative.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Initiative = sequelize.define('Initiative', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Admin must approve
    },
}, {
    // Settings
});

User.hasMany(Initiative, { foreignKey: 'organizerId' });
Initiative.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

module.exports = Initiative;