// /backend/controllers/adminController.js
const User = require('../models/User');
const Initiative = require('../models/Initiative');
const Application = require('../models/Application');

exports.getAdminMetrics = async(req, res) => {
    try {
        // Total Users
        const totalUsers = await User.count();

        // Users by Role
        const usersByRole = await User.findAll({
            attributes: ['role', [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']],
            group: ['role'],
        });

        // Total Initiatives
        const totalInitiatives = await Initiative.count();

        // Initiatives by Approval Status
        const initiativesByStatus = await Initiative.findAll({
            attributes: ['approved', [Initiative.sequelize.fn('COUNT', Initiative.sequelize.col('approved')), 'count']],
            group: ['approved'],
        });

        // Total Applications
        const totalApplications = await Application.count();

        // Applications by Status
        const applicationsByStatus = await Application.findAll({
            attributes: ['status', [Application.sequelize.fn('COUNT', Application.sequelize.col('status')), 'count']],
            group: ['status'],
        });

        res.json({
            totalUsers,
            usersByRole,
            totalInitiatives,
            initiativesByStatus,
            totalApplications,
            applicationsByStatus,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Грешка при получаване на метриките' });
    }
};