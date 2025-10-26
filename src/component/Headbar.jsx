

import React, { useState, useRef } from 'react';
import Logo from '../imagesHome/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Register from './Register';
import Login from './Login';

const Headbar = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openSignUp = () => {
    setIsLogin(false);
    setIsModelOpen(true);
  };
  const openLogin = () => {
    setIsLogin(true);
    setIsModelOpen(true);
  };

  const handleSellClick = () => {
    navigate('/add-product');
  };
  const handleLogin = () => {
    navigate('/login');
  };
  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout Successfull');
    setDropdownOpen(false);
    navigate('/');
  };

  // Dropdown close on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="logo" className="w-36 h-14 md:w-40 md:h-16 object-contain rounded" />
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1">
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 shadow-sm">
            <select className="bg-transparent outline-none text-sm text-gray-700 pr-3">
              <option value="">All Categories</option>
              <option value="mobiles">Mobiles</option>
              <option value="vehicles">Vehicles</option>
              <option value="property">Property</option>
            </select>
            <input type="text" placeholder="Search products, categories or locations" className="flex-1 bg-transparent outline-none text-sm px-2 text-gray-700" />
            <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm">Search</button>
          </div>
          {/* mobile search */}
          <div className="md:hidden">
            <input type="text" placeholder="Search..." className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link to="/shop" className="hidden md:inline text-gray-700 hover:text-gray-900 text-sm">Shop</Link>
          <button onClick={handleSellClick} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-2 rounded-md font-semibold text-sm">Sell</button>

          {!user ? (
            <>
              <button onClick={handleLogin} className="hidden md:inline text-sm text-blue-600 font-medium">Login</button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button onClick={handleProfileClick} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <img src={user?.avatar || 'https://avatars.githubusercontent.com/u/1?v=4'} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                <span className="hidden md:inline text-sm font-medium text-gray-800">{user.firstName || user.email}</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => { setDropdownOpen(false); navigate('/add-product'); }}>Add Product</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => { setDropdownOpen(false); navigate('/showproduct'); }}>My Ads</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>Profile</button>
                  <div className="border-t" />
                  <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* If you still use the modal-based login/register, keep it below (commented out if not used) */}
      {/* <Modal isModelOpen={isModelOpen } setIsModelOpen={setIsModelOpen}>
         {isLogin ? <Login openSignUp={openSignUp}/> : <Register openLogin={openLogin}/>}
       </Modal> */}
    </header>
  );
};

export default Headbar;

