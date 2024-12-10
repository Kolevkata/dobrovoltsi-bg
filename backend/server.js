// server.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const initiativeRoutes = require('./routes/initiativeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
require('dotenv').config();

// Import the Token model to ensure it's registered
const Token = require('./models/Token');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/initiatives', initiativeRoutes);
app.use('/api/applications', applicationRoutes);

// Central Error Handler
app.use(errorHandler);

// Database connection and synchronization
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync(); // Sync all models, including Token
    })
    .then(() => console.log('Models synchronized with the database'))
    .catch(err => console.log('Error: ' + err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});