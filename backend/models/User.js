// /models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    // Име на потребителя
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Имейл
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Парола
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Роля (доброволец или организатор)
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;