// /config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // Име на базата данни
    process.env.DB_USER, // Потребител
    process.env.DB_PASSWORD, // Парола
    {
        host: process.env.DB_HOST, // Хост
        dialect: 'postgres',
    }
);

module.exports = { sequelize };