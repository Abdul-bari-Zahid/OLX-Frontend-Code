import React, { useState } from 'react'
import Products from '../component/Products'
import CategoryList from '../component/CategoryLisk'
import Banner from '../component/Banner'
import { FaCog } from 'react-icons/fa'
const Shop = ({ search = '' }) => {
  const [filterOpen, setFilterOpen] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('')
  const [filter, setFilter] = useState({ minPrice: '', maxPrice: '', sort: '' })

  const handleApply = () => {
    setFilter({ minPrice, maxPrice, sort })
    setFilterOpen(false)
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <CategoryList />
      <Banner />
      
      <button
        className="fixed top-1/3 right-6 z-50 bg-white border shadow-lg rounded-full p-4 hover:bg-blue-50 transition flex items-center justify-center"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
        onClick={() => setFilterOpen(true)}
        aria-label="Open Filter"
      >
        <FaCog />
        
      </button>
      
      <div className={`transition-all duration-300 ${filterOpen ? 'mr-80' : ''}`}>
        <Products search={search} filter={filter} />
      </div>
      
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 border-l transition-transform duration-300
        ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: 340 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg text-blue-700 flex items-center gap-2">
          
            Filter & Sort
          </span>
          <button
            className="text-2xl text-gray-400 hover:text-blue-600"
            onClick={() => setFilterOpen(false)}
            aria-label="Close Filter"
          >
            &times;
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Sort By</label>
            <select value={sort} onChange={e => setSort(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Min Price</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="e.g. 1000"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Max Price</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <button
            className="bg-blue-600 text-white py-2 rounded font-semibold mt-2 hover:bg-blue-700"
            onClick={handleApply}
          >
            Apply Filter
          </button>
        </div>
      </div>
       
      {filterOpen && (
        <div
          
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  )
}

export default Shop