import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Monitor, AlertCircle } from 'lucide-react'

// All embed servers with their URL patterns
const SERVERS = [
  { name: 'Vidsrc', url: (id) => `https://vidsrc.to/embed/movie/${id}`, color: 'bg-red-600' },
  { name: '2embed', url: (id) => `https://www.2embed.cc/embed/${id}`, color: 'bg-blue-600' },
  { name: 'PrimeWire', url: (id) => `https://www.primewire.tf/embed/movie?tmdb=${id}`, color: 'bg-purple-600' },
  { name: 'Braflix', url: (id) => `https://www.braflix.video/embed/movie/${id}`, color: 'bg-orange-600' },
  { name: 'Vidplay', url: (id) => `https://vidsrc.xyz/embed/movie/${id}`, color: 'bg-green-600' },
  { name: 'Vidlink', url: (id) => `https://vidlink.pro/movie/${id}`, color: 'bg-pink-600' },
  { name: 'Flixify', url: (id) => `https://flixify.co/movie/${id}`, color: 'bg-yellow-600' },
  { name: 'Prime', url: (id) => `https://embed.su/embed/movie/${id}`, color: 'bg-indigo-600' },
  { name: '4k', url: (id) => `https://www.4k-hd.cc/embed/movie/${id}`, color: 'bg-cyan-600' },
  { name: '4k2', url: (id) => `https://4kplayer.xyz/embed/movie/${id}`, color: 'bg-teal-600' },
  { name: '4kHD', url: (id) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`, color: 'bg-emerald-600' },
  { name: 'Main', url: (id) => `https://player.autoembed.cc/movie/${id}`, color: 'bg-violet-600' },
  { name: 'Fade', url: (id) => `https://fadeland.xyz/embed/movie/${id}`, color: 'bg-rose-600' },
  { name: 'Nero', url: (id) => `https://nerostreams.xyz/embed/movie/${id}`, color: 'bg-amber-600' },
  { name: 'Astra', url: (id) => `https://astra-streams.xyz/embed/movie/${id}`, color: 'bg-lime-600' },
  { name: 'Aura', url: (id) => `https://aura-streams.com/embed/movie/${id}`, color: 'bg-sky-600' },
  { name: 'Sage', url: (id) => `https://sage-streams.net/embed/movie/${id}`, color: 'bg-fuchsia-600' },
  { name: 'Flix', url: (id) => `https://flix-streams.com/embed/movie/${id}`, color: 'bg-red-500' },
  { name: 'Vid', url: (id) => `https://vidstreams.xyz/embed/movie/${id}`, color: 'bg-blue-500' },
  { name: 'Mist', url: (id) => `https://mist-streams.com/embed/movie/${id}`, color: 'bg-green-500' },
  { name: 'Peach', url: (id) => `https://peach-streams.net/embed/movie/${id}`, color: 'bg-orange-500' },
  { name: 'Nest', url: (id) => `https://nest-streams.xyz/embed/movie/${id}`, color: 'bg-purple-500' },
  { name: 'Pass', url: (id) => `https://pass-streams.com/embed/movie/${id}`, color: 'bg-pink-500' },
  { name: 'Mistify', url: (id) => `https://mistify-streams.net/embed/movie/${id}`, color: 'bg-yellow-500' },
  { name: 'Simplify', url: (id) => `https://simplify-streams.xyz/embed/movie/${id}`, color: 'bg-indigo-500' },
  { name: 'Asia', url: (id) => `https://asia-streams.com/embed/movie/${id}`, color: 'bg-cyan-500' },
  { name: 'Cine', url: (id) => `https://cine-streams.net/embed/movie/${id}`, color: 'bg-teal-500' },
  { name: 'Vidmux', url: (id) => `https://vidmux-streams.xyz/embed/movie/${id}`, color: 'bg-emerald-500' },
  { name: 'Diablo', url: (id) => `https://diablo-streams.com/embed/movie/${id}`, color: 'bg-violet-500' },
  { name: 'Italian', url: (id) => `https://italian-streams.net/embed/movie/${id}`, color: 'bg-rose-500' },
  { name: 'vidind', url: (id) => `https://vidind-streams.xyz/embed/movie/${id}`, color: 'bg-amber-500' },
  { name: 'club', url: (id) => `https://club-streams.com/embed/movie/${id}`, color: 'bg-lime-500' },
  { name: 'Azute', url: (id) => `https://azute-streams.net/embed/movie/${id}`, color: 'bg-sky-500' },
]

function WatchPage({ API_URL }) {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedServer, setSelectedServer] = useState(0)
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    fetchMovieDetails()
  }, [id])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      // Try backend first
      const res = await fetch(`${API_URL}/content/${id}`)
      if (res.ok) {
        const data = await res.json()
        setMovie(data)
      } else {
        // Fallback to TMDB
        await fetchFromTMDB()
      }
    } catch (err) {
      await fetchFromTMDB()
    } finally {
      setLoading(false)
    }
  }

  const fetchFromTMDB = async () => {
    try {
      const apiKey = '00f294dc6a86e0ae3d2693fa8e129e10'
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`)
      if (!res.ok) throw new Error('Movie not found')
      const data = await res.json()
      setMovie({
        id: data.id,
        title: data.title,
        overview: data.overview,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        release_date: data.release_date,
        vote_average: data.vote_average,
        genre_ids: data.genres?.map(g => g.id) || [],
        runtime: data.runtime,
        tagline: data.tagline,
        credits: data.credits
      })
    } catch (e) {
      setError('Could not load movie details')
    }
  }

  const currentServer = SERVERS[selectedServer]
  const embedUrl = currentServer?.url(movie?.tmdb_id || id)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-16 h-16 text-netflix-red mb-4" />
        <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
        <p className="text-netflix-lightgray mb-6">{error || 'This movie could not be loaded.'}</p>
        <Link to="/" className="bg-netflix-red px-6 py-2 rounded hover:bg-red-700 transition-colors">
          Back to Home
        </Link>
      </div>
    )
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  const cast = movie.credits?.cast?.slice(0, 6) || []
  const directors = movie.credits?.crew?.filter(c => c.job === 'Director') || []

  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <div className="fixed top-20 left-4 z-30">
        <Link to="/" className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-black/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* Video Player */}
      <div className="relative w-full bg-black">
        <div className="relative w-full aspect-video max-h-[80vh]">
          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-netflix-dark">
              <Monitor className="w-16 h-16 text-netflix-gray mb-4" />
              <p className="text-white text-lg mb-2">This server is unavailable</p>
              <p className="text-netflix-lightgray text-sm mb-4">Try another server below</p>
              <button 
                onClick={() => setIframeError(false)}
                className="bg-netflix-red px-6 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              onError={() => setIframeError(true)}
              title={`${movie.title} - ${currentServer.name}`}
            />
          )}
        </div>
      </div>

      {/* Server Selection */}
      <div className="bg-netflix-dark border-t border-white/10 px-4 md:px-12 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="w-5 h-5 text-netflix-red" />
          <h3 className="text-white font-semibold">Select Server</h3>
          <span className="text-netflix-lightgray text-sm ml-2">({SERVERS.length} sources)</span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {SERVERS.map((server, idx) => (
            <button
              key={server.name}
              onClick={() => { setSelectedServer(idx); setIframeError(false); }}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                selectedServer === idx 
                  ? `${server.color} text-white shadow-lg` 
                  : 'bg-white/10 text-netflix-lightgray hover:bg-white/20'
              }`}
            >
              {server.name}
            </button>
          ))}
        </div>
        <p className="text-netflix-gray text-xs mt-2">
          Currently playing from: <span className="text-white font-medium">{currentServer.name}</span>
        </p>
      </div>

      {/* Movie Info */}
      <div className="px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.title}
              className="w-48 md:w-64 rounded-lg shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-netflix-lightgray italic mb-4">{movie.tagline}</p>}

            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="text-green-400 font-semibold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
              <span className="text-netflix-lightgray">{movie.release_date?.slice(0, 4)}</span>
              {movie.runtime && <span className="text-netflix-lightgray">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
              <span className="border border-white/40 px-1.5 text-xs">HD</span>
            </div>

            <p className="text-white text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
              {movie.overview}
            </p>

            {directors.length > 0 && (
              <div className="mb-3">
                <span className="text-netflix-gray">Director: </span>
                <span className="text-white">{directors.map(d => d.name).join(', ')}</span>
              </div>
            )}

            {cast.length > 0 && (
              <div className="mb-6">
                <span className="text-netflix-gray">Cast: </span>
                <span className="text-white">{cast.map(c => c.name).join(', ')}</span>
              </div>
            )}

            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genre_ids.map(gid => {
                  const genreMap = {
                    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
                    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
                    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
                    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
                  }
                  return (
                    <span key={gid} className="bg-white/10 px-3 py-1 rounded-full text-sm text-netflix-lightgray">
                      {genreMap[gid] || 'Genre'}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchPage
