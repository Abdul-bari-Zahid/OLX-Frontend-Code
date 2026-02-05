

import React, { useState, useRef, useEffect } from 'react';
import Logo from '../imagesHome/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Register from './Register';
import Login from './Login';
import { socket } from '../socket.js';

const Headbar = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState(null);
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

  // Identify the connected user to the socket server and listen for notifications
  useEffect(() => {
    if (!user) return;
    try {
      // Wait until socket is connected, then identify the user so server can notify them
      const emitIdentify = () => {
        try {
          const userId = user._id || user.id || user.uid || user.userId || user?.userId;
          console.log('Headbar: socket connected?', socket.connected, 'identifying user:', userId, 'user object:', user);
          socket.emit('identify', userId);
        } catch (err) {
          console.error('Headbar identify emit error', err);
        }
      };

      if (socket.connected) {
        emitIdentify();
      } else {
        socket.once('connect', emitIdentify);
      }

      const handleNewMessage = (payload) => {
        // payload: { productId, senderId, senderName, text, messageId }
        console.log('Headbar received new-message-notification', payload);
        setUnreadCount((c) => c + 1);
        setLastNotification(payload);
        toast.info(`New message from ${payload.senderName}: ${payload.text}`, { autoClose: 3000 });
      };

      socket.on('new-message-notification', handleNewMessage);

      return () => {
        socket.off('new-message-notification', handleNewMessage);
        socket.off('connect', emitIdentify);
      };
    } catch (err) {
      console.error('socket identify error', err);
    }
  }, [user]);

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

          {/* Notification bell */}
          {user && (
            <button
                onClick={() => {
                  setUnreadCount(0);
                  // If we have a last notification, pass it into the messages page so it can open the right chat
                  if (lastNotification && lastNotification.productId) {
                    navigate('/messages', { state: { productId: lastNotification.productId, senderId: lastNotification.senderId, senderName: lastNotification.senderName } });
                    // clear lastNotification after navigating
                    setLastNotification(null);
                  } else {
                    navigate('/messages');
                  }
                }}
              className="relative hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
              title="Messages"
            >
              <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

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

