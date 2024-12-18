// /middleware/optionalAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.optionalAuth = async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(); // No token, no user
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (user) {
            req.user = user;
        }
    } catch (err) {
        console.error(err);
    }
    next();
};