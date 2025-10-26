import React, { useState, useEffect } from 'react'
import Searchbar from '../component/Searchbar'
import CategoryList from '../component/CategoryLisk'
import Banner from '../component/Banner'
import BannerImage from '../imagesHome/banner.png'
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
 
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setPopupVisible(true) 
  //     setTimeout(() => setShowLoginPopup(true), 300)   
  //   }, 5000)
  //   return () => clearTimeout(timer)  
  // }, [])

  const closeLoginPopup = () => {
    setPopupVisible(false)  
    setTimeout(() => setShowLoginPopup(false), 300)  
  }

  const user = useSelector(state => state.user.user)
  const [notifications, setNotifications] = useState([])

  useEffect(()=>{
    let mounted = true
    if (!user || !user.token) return
    (async ()=>{
      try{
        const res = await axios.get(`${API}/api/user/me`, { headers: { Authorization: `Bearer ${user.token}` } })
        if (!mounted) return
        setNotifications(res.data.notifications || [])
      }catch(err){
        // ignore
      }
    })()
    return ()=>{ mounted = false }
  }, [user])

  const handleApply = () => {
    setFilter({ minPrice, maxPrice, sort })
    setFilterOpen(false)
  }

  return (
    <div>
      <Searchbar setSearch={setSearch} />

      {/* Hero section under header (left text + CTAs, right image) */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white flex flex-col md:flex-row items-center">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find Your Perfect
              <span className="text-yellow-300"> Deal Today</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6">Discover amazing products at unbeatable prices. Buy, sell, and connect with trusted sellers.</p>
            <div className="flex gap-4 mb-6">
              <button onClick={() => {}} className="bg-yellow-400 text-black px-5 py-2 rounded font-semibold">Start Shopping</button>
              <button onClick={() => {}} className="border border-white/50 px-5 py-2 rounded font-semibold">Sell Something</button>
            </div>
            <div className="flex gap-8 text-sm mt-4">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-white/80">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-white/80">Active Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-white/80">Categories</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img src={BannerImage} alt="hero" className="w-40 h-40 object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* All Categories Section */}
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
 
      {/* {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`relative bg-white rounded-lg shadow-lg p-6 w-96 transition-transform duration-300 ${
              popupVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
          >
            <LoginPage />  
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
              onClick={closeLoginPopup}
            >
              &times;
            </button>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default Home