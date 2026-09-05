import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Info, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react'

function HeroBanner({ movies, addToList, removeFromList, isInList }) {
  const [current, setCurrent] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const featured = movies?.slice(0, 6) || []

  useEffect(() => {
    if (featured.length > 0) setIsReady(true)
  }, [featured.length])

  useEffect(() => {
    if (!isReady || featured.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % featured.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [isReady, featured.length])

  if (!isReady || featured.length === 0) {
    return (
      <div className="relative h-[70vh] w-full bg-netflix-dark flex items-center justify-center">
        <div className="animate-pulse text-netflix-lightgray">Loading featured content...</div>
      </div>
    )
  }

  const movie = featured[current]
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`

  const nextSlide = () => setCurrent((current + 1) % featured.length)
  const prevSlide = () => setCurrent((current - 1 + featured.length) % featured.length)

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-16 md:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {movie.title || movie.name}
          </h1>
          <div className="flex items-center gap-3 mb-4 text-sm md:text-base">
            <span className="text-green-400 font-semibold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
            <span className="text-netflix-lightgray">{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}</span>
            <span className="border border-white/40 px-1 text-xs">HD</span>
          </div>
          <p className="text-netflix-lightgray text-sm md:text-lg mb-6 line-clamp-3 drop-shadow">
            {movie.overview}
          </p>
          <div className="flex items-center gap-3">
            <Link 
              to={`/watch/${movie.id}`}
              className="flex items-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded font-semibold hover:bg-white/90 transition-colors"
            >
              <Play className="w-5 h-5 fill-black" />
              Play
            </Link>
            <button 
              onClick={() => isInList(movie.id) ? removeFromList(movie.id) : addToList(movie)}
              className="flex items-center gap-2 bg-white/20 text-white px-6 py-2 md:px-8 md:py-3 rounded font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              {isInList(movie.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {isInList(movie.id) ? 'In My List' : 'My List'}
            </button>
            <Link 
              to={`/watch/${movie.id}`}
              className="flex items-center gap-2 bg-white/20 text-white px-6 py-2 md:px-8 md:py-3 rounded font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-6 right-12 flex gap-2">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-netflix-red w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default HeroBanner
