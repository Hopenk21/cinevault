import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import WatchPage from './pages/WatchPage'
import SearchPage from './pages/SearchPage'
import MyListPage from './pages/MyListPage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function App() {
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem('cinevault_mylist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cinevault_mylist', JSON.stringify(myList))
  }, [myList])

  const addToList = (item) => {
    if (!myList.find(i => i.id === item.id)) {
      setMyList([...myList, item])
    }
  }

  const removeFromList = (id) => {
    setMyList(myList.filter(i => i.id !== id))
  }

  const isInList = (id) => myList.some(i => i.id === id)

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage API_URL={API_URL} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />} />
        <Route path="/watch/:id" element={<WatchPage API_URL={API_URL} />} />
        <Route path="/search" element={<SearchPage API_URL={API_URL} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />} />
        <Route path="/mylist" element={<MyListPage myList={myList} removeFromList={removeFromList} />} />
        <Route path="/movies" element={<HomePage API_URL={API_URL} addToList={addToList} removeFromList={removeFromList} isInList={isInList} filter="movies" />} />
        <Route path="/series" element={<HomePage API_URL={API_URL} addToList={addToList} removeFromList={removeFromList} isInList={isInList} filter="series" />} />
      </Routes>
    </div>
  )
}

export default App
