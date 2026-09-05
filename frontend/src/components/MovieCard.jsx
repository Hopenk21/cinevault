import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react'

function MovieCard({ movie, addToList, removeFromList, isInList }) {
  const [hovered, setHovered] = useState(false)

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster'

  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const rating = Math.round((movie.vote_average || 0) * 10)
  const genres = movie.genre_ids?.slice(0, 3) || []

  const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi', 10766: 'Soap', 10767: 'Talk', 10768: 'War', 10769: 'Foreign'
  }

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative rounded-md overflow-hidden transition-all duration-300 ${hovered ? 'shadow-2xl shadow-black' : ''}`}>
        <img 
          src={posterUrl} 
          alt={movie.title || movie.name}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
        />

        {hovered && (
          <div className="absolute inset-0 bg-netflix-dark/95 flex flex-col justify-end p-3 transition-opacity duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Link 
                to={`/watch/${movie.id}`}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/90"
              >
                <Play className="w-4 h-4 text-black fill-black" />
              </Link>
              <button 
                onClick={(e) => { e.stopPropagation(); isInList(movie.id) ? removeFromList(movie.id) : addToList(movie); }}
                className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center hover:border-white"
              >
                {isInList(movie.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center hover:border-white">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <Link 
                to={`/watch/${movie.id}`}
                className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center hover:border-white ml-auto"
              >
                <ChevronDown className="w-4 h-4" />
              </Link>
            </div>

            <div className="text-xs mb-1">
              <span className="text-green-400 font-semibold">{rating}% Match</span>
              <span className="text-netflix-lightgray ml-2">{year}</span>
              <span className="border border-white/40 px-1 ml-2 text-[10px]">HD</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {genres.map(gid => (
                <span key={gid} className="text-[10px] text-netflix-lightgray">
                  {genreMap[gid] || 'Genre'}
                </span>
              )).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, <span key={`dot-${i}`} className="text-[10px] text-netflix-lightgray">•</span>, curr], [])}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard
