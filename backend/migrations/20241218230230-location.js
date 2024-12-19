// /migrations/YYYYMMDDHHMMSS-remove-location-from-initiatives.js
'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Initiatives', 'location');
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('Initiatives', 'location', {
            type: Sequelize.STRING,
            allowNull: false,
        });
    }
};