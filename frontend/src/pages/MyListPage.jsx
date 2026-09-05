import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Film, ArrowLeft } from 'lucide-react'
import MovieCard from '../components/MovieCard'

function MyListPage({ myList, removeFromList }) {
  const isInList = () => true

  return (
    <div className="pt-24 pb-12 px-4 md:px-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-netflix-red" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">My List</h1>
        <span className="text-netflix-lightgray text-sm">({myList.length} titles)</span>
      </div>

      {myList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-netflix-lightgray">
          <Film className="w-16 h-16 mb-4 text-netflix-gray" />
          <p className="text-xl mb-2">Your list is empty</p>
          <p className="text-sm mb-6">Add movies and shows to watch later</p>
          <Link to="/" className="bg-netflix-red px-6 py-2 rounded hover:bg-red-700 transition-colors text-white">
            Browse Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {myList.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              addToList={() => {}}
              removeFromList={removeFromList}
              isInList={isInList}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyListPage
