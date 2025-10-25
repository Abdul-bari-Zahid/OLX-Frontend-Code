import React from 'react'

const PriceFilterSidebar = ({
  open,
  onClose,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  sort,
  setSort,
  onApply
}) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-bold text-lg">Filter & Sort</h3>
        <button onClick={onClose} className="text-xl">&times;</button>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">Sort By</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="">Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="latest">Latest</option>
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
          className="bg-blue-600 text-white py-2 rounded font-semibold mt-2"
          onClick={onApply}
        >
          Apply Filter
        </button>
      </div>
    </div>
  )
}

export default PriceFilterSidebar