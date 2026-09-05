const { pool } = require('../config/database');
const { getTrendingMovies, getTopRatedMovies, getMoviesByGenre, getTrendingTV } = require('./tmdb');

const GENRES = {
    action: 28,
    comedy: 35,
    horror: 27,
    scifi: 878,
    drama: 18,
    thriller: 53
};

async function seedDatabase() {
    const client = await pool.connect();
    try {
        // Check if already seeded
        const countRes = await client.query('SELECT COUNT(*) FROM movies');
        if (parseInt(countRes.rows[0].count) > 20) {
            console.log('Database already seeded with', countRes.rows[0].count, 'movies');
            return;
        }

        console.log('Fetching TMDB data...');

        // Fetch all data in parallel
        const [
            trendingMovies,
            topRatedMovies,
            actionMovies,
            comedyMovies,
            horrorMovies,
            scifiMovies,
            trendingTV
        ] = await Promise.all([
            getTrendingMovies(),
            getTopRatedMovies(),
            getMoviesByGenre(GENRES.action),
            getMoviesByGenre(GENRES.comedy),
            getMoviesByGenre(GENRES.horror),
            getMoviesByGenre(GENRES.scifi),
            getTrendingTV()
        ]);

        // Combine and deduplicate movies
        const allMovies = new Map();

        [...trendingMovies, ...topRatedMovies, ...actionMovies, ...comedyMovies, ...horrorMovies, ...scifiMovies].forEach(m => {
            if (m && m.id && !allMovies.has(m.id)) {
                allMovies.set(m.id, m);
            }
        });

        // Insert movies
        let insertedMovies = 0;
        for (const movie of allMovies.values()) {
            try {
                await client.query(`
                    INSERT INTO movies (tmdb_id, title, overview, poster_path, backdrop_path, release_date, vote_average, genre_ids, media_type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    ON CONFLICT (tmdb_id) DO NOTHING
                `, [
                    movie.id,
                    movie.title || movie.name || 'Unknown',
                    movie.overview || '',
                    movie.poster_path || '',
                    movie.backdrop_path || '',
                    movie.release_date || movie.first_air_date || '',
                    movie.vote_average || 0,
                    movie.genre_ids || [],
                    'movie'
                ]);
                insertedMovies++;
            } catch (e) {
                console.error('Error inserting movie:', e.message);
            }
        }

        // Insert TV shows
        let insertedTV = 0;
        for (const show of trendingTV.slice(0, 20)) {
            try {
                await client.query(`
                    INSERT INTO series (tmdb_id, name, overview, poster_path, backdrop_path, first_air_date, vote_average, genre_ids, media_type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    ON CONFLICT (tmdb_id) DO NOTHING
                `, [
                    show.id,
                    show.name || 'Unknown',
                    show.overview || '',
                    show.poster_path || '',
                    show.backdrop_path || '',
                    show.first_air_date || '',
                    show.vote_average || 0,
                    show.genre_ids || [],
                    'tv'
                ]);
                insertedTV++;
            } catch (e) {
                console.error('Error inserting series:', e.message);
            }
        }

        console.log(`Seeded ${insertedMovies} movies and ${insertedTV} TV shows`);

    } catch (error) {
        console.error('Seed error:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = { seedDatabase };
