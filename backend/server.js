const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { pool, initSchema } = require('./config/database');
const { seedDatabase } = require('./services/seed');
const contentRoutes = require('./routes/content');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - allow frontend domain
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/content', contentRoutes);
app.use('/api/health', healthRoutes);

// Root
app.get('/', (req, res) => {
    res.json({ message: 'CineVault API is running', version: '1.0.0' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

async function startServer() {
    try {
        // Initialize database schema
        await initSchema();
        console.log('Database schema ready');

        // Seed database with TMDB data
        await seedDatabase();
        console.log('Database seeded');

        app.listen(PORT, () => {
            console.log(`CineVault server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
