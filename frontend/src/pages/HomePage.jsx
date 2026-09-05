import React, { useState, useEffect } from 'react'
import HeroBanner from '../components/HeroBanner'
import MovieRow from '../components/MovieRow'

function HomePage({ API_URL, addToList, removeFromList, isInList, filter }) {
  const [content, setContent] = useState({ movies: [], series: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/content`, { 
        headers: { 'Accept': 'application/json' }
      })
      if (!res.ok) throw new Error('Failed to fetch content')
      const data = await res.json()
      setContent(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
      // Fallback: try direct TMDB
      fetchFromTMDB()
    } finally {
      setLoading(false)
    }
  }

  const fetchFromTMDB = async () => {
    try {
      const apiKey = '00f294dc6a86e0ae3d2693fa8e129e10'
      const [trending, topRated, action, comedy, horror, scifi] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878&sort_by=popularity.desc`).then(r => r.json()),
      ])

      const movies = [
        ...(trending.results || []),
        ...(topRated.results || []),
        ...(action.results || []),
        ...(comedy.results || []),
        ...(horror.results || []),
        ...(scifi.results || []),
      ]

      // Deduplicate
      const unique = []
      const seen = new Set()
      movies.forEach(m => {
        if (!seen.has(m.id)) {
          seen.add(m.id)
          unique.push(m)
        }
      })

      setContent({ movies: unique, series: [] })
    } catch (e) {
      console.error('TMDB fallback failed:', e)
    }
  }

  const allContent = [...content.movies, ...content.series]

  const trending = allContent.slice(0, 15)
  const topRated = [...allContent].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 15)
  const actionMovies = allContent.filter(m => m.genre_ids?.includes(28)).slice(0, 15)
  const comedyMovies = allContent.filter(m => m.genre_ids?.includes(35)).slice(0, 15)
  const horrorMovies = allContent.filter(m => m.genre_ids?.includes(27)).slice(0, 15)
  const scifiMovies = allContent.filter(m => m.genre_ids?.includes(878)).slice(0, 15)
  const dramaMovies = allContent.filter(m => m.genre_ids?.includes(18)).slice(0, 15)
  const newReleases = [...allContent].sort((a, b) => {
    const dateA = new Date(a.release_date || a.first_air_date || '2000-01-01')
    const dateB = new Date(b.release_date || b.first_air_date || '2000-01-01')
    return dateB - dateA
  }).slice(0, 15)

  if (loading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error && allContent.length === 0) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-screen text-netflix-lightgray">
        <p className="mb-4">Unable to load content. Please try again later.</p>
        <button onClick={fetchContent} className="bg-netflix-red px-6 py-2 rounded hover:bg-red-700 transition-colors">
          Retry
        </button>
      </div>
    )
  }

  if (filter === 'movies') {
    return (
      <div className="pt-20 pb-12">
        <h1 className="text-3xl font-bold px-4 md:px-12 mb-8">Movies</h1>
        <MovieRow title="Trending Now" movies={trending} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Top Rated" movies={topRated} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Action" movies={actionMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Comedy" movies={comedyMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Horror" movies={horrorMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Sci-Fi" movies={scifiMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
      </div>
    )
  }

  if (filter === 'series') {
    const series = content.series?.length > 0 ? content.series : allContent.slice(15, 30)
    return (
      <div className="pt-20 pb-12">
        <h1 className="text-3xl font-bold px-4 md:px-12 mb-8">TV Series</h1>
        <MovieRow title="Popular Series" movies={series} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Trending" movies={series.slice(0, 15)} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Drama" movies={dramaMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
      </div>
    )
  }

  return (
    <div>
      <HeroBanner 
        movies={allContent} 
        addToList={addToList} 
        removeFromList={removeFromList} 
        isInList={isInList} 
      />
      <div className="relative z-10 -mt-16 pb-12">
        <MovieRow title="Trending Now" movies={trending} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="New Releases" movies={newReleases} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Top Rated" movies={topRated} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Action & Adventure" movies={actionMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Comedy" movies={comedyMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Horror" movies={horrorMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Sci-Fi" movies={scifiMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
        <MovieRow title="Drama" movies={dramaMovies} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
      </div>
    </div>
  )
}

export default HomePage
