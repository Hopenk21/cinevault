# CineVault - Streaming Platform

A Netflix-style movie streaming site with 33+ embed sources.

## Features

- Netflix-style UI with hero banner and scrolling movie rows
- 33+ video servers (Vidsrc, 2embed, Braflix, PrimeWire, etc.)
- TMDB integration for movie data and posters
- Search functionality
- My List (saved to localStorage)
- Responsive design

## Deploy

### Backend (Render)

1. Push this repo to GitHub
2. Create Web Service on Render
   - Root Directory: `backend`
   - Build Command: `npm install && npm run db:init && npm run db:seed`
   - Start Command: `npm start`
3. Add Environment Variables:
   - `DATABASE_URL` - PostgreSQL connection string (Neon recommended)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Surge domain
   - `TMDB_API_KEY` = your TMDB API key
   - `TMDB_READ_ACCESS_TOKEN` = your TMDB read token

### Frontend (Surge)

```bash
cd frontend
echo "VITE_API_URL=https://your-backend.onrender.com/api" > .env.production
npm install
npm run build
npx surge dist your-domain.surge.sh
```

## Servers Included

Braflix, Azute, 4k, Vid, Mist, Peach, Nest, Pass, Mistify, Simplify, Asia, Cine, Vidmux, Diablo, Italian, vidind, 4k2, Prime, Main, 4kHD, Fade, Vidlink, Nero, Flixify, Astra, Vidplay, Vidsrc, 2embed, PrimeWire, club, Sage, Aura, Flix
