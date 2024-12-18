// /models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100],
        },
    },
    role: {
        type: DataTypes.ENUM('volunteer', 'organizer', 'admin'),
        allowNull: false,
        defaultValue: 'volunteer',
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true, // Stores the image filename/path
    },
}, {
    hooks: {
        beforeCreate: async(user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async(user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: {},
        },
    },
});

User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;