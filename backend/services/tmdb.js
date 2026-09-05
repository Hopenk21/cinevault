const https = require('https');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'api.themoviedb.org';

function fetchTMDB(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: TMDB_BASE,
            path: path + (path.includes('?') ? '&' : '?') + `api_key=${TMDB_API_KEY}`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'CineVault/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('TMDB request timeout'));
        });
        req.end();
    });
}

async function getTrendingMovies() {
    const data = await fetchTMDB('/3/trending/movie/week?language=en-US');
    return data.results || [];
}

async function getTopRatedMovies() {
    const data = await fetchTMDB('/3/movie/top_rated?language=en-US&page=1');
    return data.results || [];
}

async function getMoviesByGenre(genreId) {
    const data = await fetchTMDB(`/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`);
    return data.results || [];
}

async function getTrendingTV() {
    const data = await fetchTMDB('/3/trending/tv/week?language=en-US');
    return data.results || [];
}

async function getMovieDetails(tmdbId) {
    const data = await fetchTMDB(`/3/movie/${tmdbId}?language=en-US`);
    return data;
}

module.exports = {
    fetchTMDB,
    getTrendingMovies,
    getTopRatedMovies,
    getMoviesByGenre,
    getTrendingTV,
    getMovieDetails
};
