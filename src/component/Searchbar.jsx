import React, { useState } from 'react'
import Video from "../imagesHome/video.mp4"

const Searchbar = ({ setSearch }) => {
  const [input, setInput] = useState('')
  const [city, setCity] = useState('')

  // Update search on city change
  const handleCityChange = (e) => {
    setCity(e.target.value)
    setSearch((e.target.value ? e.target.value + ' ' : '') + input)
  }

  // Update search on input change
  const handleInputChange = (e) => {
    setInput(e.target.value)
    setSearch((city ? city + ' ' : '') + e.target.value)
  }

  // On form submit
  const handleSearch = (e) => {
    e.preventDefault()
    setSearch((city ? city + ' ' : '') + input)
  }

  return (
    <div className="relative w-full h-[200px] sm:h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80 -z-10"
        autoPlay
        muted
        loop
      >
        <source src={Video} type="video/mp4" />
      </video>
      <form
        onSubmit={handleSearch}
        className="relative z-10 flex flex-col sm:flex-row gap-2 w-full max-w-2xl justify-center items-center bg-white/70 rounded-lg p-4"
      >
        <select
          className="border rounded px-3 py-2"
          value={city}
          onChange={handleCityChange}
        >
          <option value="">All Pakistan</option>
          <option value="Lahore">Lahore</option>
          <option value="Faisalabad">Faisalabad</option>
          <option value="Rawalpindi">Rawalpindi</option>
          <option value="Gujranwala">Gujranwala</option>
          <option value="Peshawar">Peshawar</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Quetta">Quetta</option>
          <option value="Sialkot">Sialkot</option>
          <option value="Karachi">Karachi</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Multan">Multan</option>
          <option value="Sahiwal">Sahiwal</option>
          <option value="Okara">Okara</option>
          <option value="Model Town">Model Town</option>
          <option value="Bahria Town">Bahria Town</option>
          <option value="DHA">DHA</option>
          <option value="Gulshan">Gulshan</option>
        </select>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2 flex-1"
            value={input}
            onChange={handleInputChange}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default Searchbar