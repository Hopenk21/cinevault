import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'

function MovieRow({ title, movies, addToList, removeFromList, isInList }) {
  const rowRef = useRef(null)

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="relative group mb-8">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3 px-4 md:px-12">{title}</h2>

      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div ref={rowRef} className="movie-row">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              addToList={addToList}
              removeFromList={removeFromList}
              isInList={isInList}
            />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  )
}

export default MovieRow
