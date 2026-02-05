import React, { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';

const Hero = ({ setSearch }) => {
    const [input, setInput] = useState('');
    const [city, setCity] = useState('');

    const handleCityChange = (e) => {
        const newCity = e.target.value;
        setCity(newCity);
        // Combine city and input for the search filter
        setSearch((newCity ? newCity + ' ' : '') + input);
    };

    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setInput(newInput);
        // Combine city and input for the search filter
        setSearch((city ? city + ' ' : '') + newInput);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch((city ? city + ' ' : '') + input);
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full h-[500px] bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 overflow-hidden flex items-center justify-center text-white">

            {/* Abstract Background Shapes */}
            <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-2xl animate-fade-in-up">
                    Buy, Sell & Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Everything</span> <br />
                    Near You
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light animate-fade-in-up delay-100">
                    The largest marketplace for your local community.
                    Connect with trusted sellers and buyers in seconds.
                </p>

                {/* Search Bar Container */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl animate-fade-in-up delay-200 focus-within:bg-white/20 transition-all duration-300">

                    {/* City Dropdown */}
                    <div className="flex items-center w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/20 px-4 py-2">
                        <FiMapPin className="text-yellow-400 mr-2" size={20} />
                        <select
                            value={city}
                            onChange={handleCityChange}
                            className="w-full bg-transparent border-none outline-none text-white placeholder-white appearance-none cursor-pointer text-lg"
                        >
                            <option value="" className="text-gray-800">All Pakistan</option>
                            <option value="Lahore" className="text-gray-800">Lahore</option>
                            <option value="Karachi" className="text-gray-800">Karachi</option>
                            <option value="Islamabad" className="text-gray-800">Islamabad</option>
                            <option value="Rawalpindi" className="text-gray-800">Rawalpindi</option>
                            <option value="Faisalabad" className="text-gray-800">Faisalabad</option>
                            <option value="Peshawar" className="text-gray-800">Peshawar</option>
                            <option value="Multan" className="text-gray-800">Multan</option>
                            <option value="Quetta" className="text-gray-800">Quetta</option>
                        </select>
                    </div>

                    {/* Search Input */}
                    <div className="flex items-center w-full md:w-2/3 px-4 py-2">
                        <FiSearch className="text-gray-300 mr-2" size={20} />
                        <input
                            type="text"
                            className="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-300 text-lg"
                            placeholder="What are you looking for?"
                            value={input}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="w-full md:w-auto mt-2 md:mt-0 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                    >
                        Search
                    </button>
                </form>

                {/* Quick Categories Tags */}
                <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-300">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-wider mr-2 self-center">Popular:</span>
                    {['Mobiles', 'Cars', 'Furniture', 'Jobs', 'Real Estate'].map((tag) => (
                        <span
                            key={tag}
                            onClick={() => {
                                setInput(tag);
                                setSearch(tag);
                            }}
                            className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-200 hover:bg-white/20 hover:text-white cursor-pointer transition backdrop-blur-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
