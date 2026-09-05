const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initSchema() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS movies (
                id SERIAL PRIMARY KEY,
                tmdb_id INTEGER UNIQUE,
                title VARCHAR(255) NOT NULL,
                overview TEXT,
                poster_path VARCHAR(255),
                backdrop_path VARCHAR(255),
                release_date VARCHAR(20),
                vote_average DECIMAL(3,1),
                genre_ids INTEGER[],
                media_type VARCHAR(20) DEFAULT 'movie',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS series (
                id SERIAL PRIMARY KEY,
                tmdb_id INTEGER UNIQUE,
                name VARCHAR(255) NOT NULL,
                overview TEXT,
                poster_path VARCHAR(255),
                backdrop_path VARCHAR(255),
                first_air_date VARCHAR(20),
                vote_average DECIMAL(3,1),
                genre_ids INTEGER[],
                media_type VARCHAR(20) DEFAULT 'tv',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('Schema initialized successfully');
    } finally {
        client.release();
    }
}

module.exports = { pool, initSchema };
