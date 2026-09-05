import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Film } from 'lucide-react'
import MovieCard from '../components/MovieCard'

function SearchPage({ API_URL, addToList, removeFromList, isInList }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      searchMovies()
    }
  }, [query])

  const searchMovies = async () => {
    setLoading(true)
    try {
      const apiKey = '00f294dc6a86e0ae3d2693fa8e129e10'
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`)
      const data = await res.json()
      const filtered = (data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      setResults(filtered)
    } catch (e) {
      console.error('Search error:', e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Search className="w-6 h-6 text-netflix-lightgray" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Search Results for "{query}"
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full" />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-netflix-lightgray">
          <Film className="w-16 h-16 mb-4 text-netflix-gray" />
          <p className="text-xl mb-2">No results found</p>
          <p className="text-sm">Try searching for a different movie or show</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              addToList={addToList}
              removeFromList={removeFromList}
              isInList={isInList}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
