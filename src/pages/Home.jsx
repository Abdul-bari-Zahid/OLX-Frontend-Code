import React, { useState, useEffect } from 'react'
import Searchbar from '../component/Searchbar'
import CategoryList from '../component/CategoryLisk'
import Banner from '../component/Banner'
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
      <CategoryList />
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
      <Banner />
      <div className="flex justify-end px-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-8 rounded font-semibold mb-4"
          onClick={() => setFilterOpen(true)}
        >
          Filter & Sort
        </button>
      </div>
      <CategorySection />
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
      <Products search={search} filter={filter} />
 
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