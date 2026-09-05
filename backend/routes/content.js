const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/content - all movies and series
router.get('/', async (req, res) => {
    try {
        const moviesResult = await pool.query('SELECT * FROM movies ORDER BY vote_average DESC LIMIT 100');
        const seriesResult = await pool.query('SELECT * FROM series ORDER BY vote_average DESC LIMIT 50');

        res.json({
            movies: moviesResult.rows,
            series: seriesResult.rows
        });
    } catch (error) {
        console.error('Content error:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// GET /api/content/movies
router.get('/movies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies ORDER BY vote_average DESC LIMIT 100');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// GET /api/content/series
router.get('/series', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM series ORDER BY vote_average DESC LIMIT 50');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch series' });
    }
});

// GET /api/content/:id
router.get('/:id', async (req, res) => {
    try {
        const movieResult = await pool.query('SELECT * FROM movies WHERE id = $1', [req.params.id]);
        if (movieResult.rows.length > 0) {
            return res.json(movieResult.rows[0]);
        }

        const seriesResult = await pool.query('SELECT * FROM series WHERE id = $1', [req.params.id]);
        if (seriesResult.rows.length > 0) {
            return res.json(seriesResult.rows[0]);
        }

        res.status(404).json({ error: 'Content not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

module.exports = router;
