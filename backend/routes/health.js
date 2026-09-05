const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const movieCount = await pool.query('SELECT COUNT(*) FROM movies');
        const seriesCount = await pool.query('SELECT COUNT(*) FROM series');

        res.json({
            status: 'ok',
            movies: parseInt(movieCount.rows[0].count),
            series: parseInt(seriesCount.rows[0].count),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
