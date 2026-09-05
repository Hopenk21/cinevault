import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, User, Menu, X } from 'lucide-react'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/series', label: 'Series' },
    { to: '/mylist', label: 'My List' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-netflix-black' : 'nav-gradient'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-netflix-red text-2xl font-bold tracking-wider">CineVault</Link>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className={`transition-colors hover:text-gray-300 ${location.pathname === link.to ? 'text-white font-medium' : 'text-netflix-lightgray'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center bg-black/70 border border-white/30 rounded px-2">
              <Search className="w-4 h-4 text-white" />
              <input
                type="text"
                autoFocus
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm px-2 py-1 outline-none w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X className="w-4 h-4 text-white" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)}>
              <Search className="w-5 h-5 text-white" />
            </button>
          )}

          <button className="hidden md:block">
            <Bell className="w-5 h-5 text-white" />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-black border-t border-white/10 px-4 py-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-2 text-white hover:text-netflix-lightgray"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
