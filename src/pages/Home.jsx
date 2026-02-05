import React, { useState, useEffect } from 'react'
import Hero from '../component/Hero'
import CategoryList from '../component/CategoryLisk'
import CategorySection from '../component/Categoryinfo'
import Products from '../component/Products'
import PriceFilterSidebar from '../component/PriceFilterSidebar'
import LoginPage from '../component/Login'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { API } from '../App'

const Home = () => {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('')
  const [filter, setFilter] = useState({ minPrice: '', maxPrice: '', sort: '' })
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)


  const closeLoginPopup = () => {
    setPopupVisible(false)
    setTimeout(() => setShowLoginPopup(false), 300)
  }

  const user = useSelector(state => state.user.user)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let mounted = true
    if (!user || !user.token) return
    (async () => {
      try {
        const res = await axios.get(`${API}/api/user/me`, { headers: { Authorization: `Bearer ${user.token}` } })
        if (!mounted) return
        setNotifications(res.data.notifications || [])
      } catch (err) {
      }
    })()
    return () => { mounted = false }
  }, [user])

  const handleApply = () => {
    setFilter({ minPrice, maxPrice, sort })
    setFilterOpen(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Hero setSearch={setSearch} />


      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">All Categories</h2>
        <CategoryList />
      </div>

      <PriceFilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        onApply={handleApply}
      />

      <div className="flex justify-end px-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-8 rounded font-semibold mb-4"
          onClick={() => setFilterOpen(true)}
        >
          Filter & Sort
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <ul className="list-disc pl-5">
            {notifications.map((n, idx) => (
              <li key={idx} className="text-sm text-gray-700">{n.text} <span className="text-xs text-gray-400">({new Date(n.date).toLocaleString()})</span></li>
            ))}
          </ul>
        </div>
      )}
      <Products search={search} filter={filter} title="All Products" />

    </div>
  )
}

export default Home