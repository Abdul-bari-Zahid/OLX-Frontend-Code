import React, {useState, useRef} from 'react';
import Logo from '../imagesHome/logo.png'
import Car from '../imagesHome/vehicles.webp'
import House from '../imagesHome/house.jpeg'
import { Link , useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { toast } from 'react-toastify';
import Modal from './Modal'
import Register from './Register'
import Login from './Login'
const Headbar = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

 const openSignUp = () =>{
    setIsLogin(false)
    setIsModelOpen(true)
  }
  const openLogin = () =>{
    setIsLogin(true)
    setIsModelOpen(true)
  }
    const navigate = useNavigate()

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
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-sky-100 md:h-24 gap-4">
      {/* Logo */}
      <div className="logo flex-shrink-0 mb-3 ">
       <Link to="/"> 
       <img
          src={Logo}
          alt=""
          // className="w-16 h-16 md:w-20 md:h-20 bg-white p-2 md:p-4 rounded-lg mt-0 md:mt-4 mx-auto"
          className="w-48 h-24 mix-blend-multiply md:w-32 md:h-20 bg-white p-2 md:p-4 rounded-lg mt-0 md:mt-4 mx-auto "
        />
      
        </Link>
      </div>

      {/* Categories */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between items-center">
        <div className="flex items-center">
          {/* <img src={Car} alt="" className="w-12 h-8 md:w-18 md:h-10 mix-blend-multiply" /> */}
          
          <Link to="/" className="hover:underline"><h4 className="font-semibold text-base md:text-lg ml-2 hover:underline">Home</h4>
          </Link>
        </div>
        <div className="flex items-center">
          {/* <img src={House} alt="" className="w-12 h-8 md:w-18 md:h-10 mix-blend-multiply" /> */}
          {/* <h4 className="font-semibold text-base md:text-lg ml-2 hover:underline">Property</h4> */}
           <Link to="/shop" className="hover:underline"><h4 className="font-semibold text-base md:text-lg ml-2 hover:underline">Shop</h4>
          </Link>
        </div>
      </div>

      {/* Buttons / Profile Dropdown */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between mt-2 md:mt-0 relative">
        {!user ? (
          <>
            <button className="font-semibold text-base md:text-lg underline" onClick={handleLogin}>Login</button>
            <button
              className="font-semibold text-base md:text-lg bg-blue-500 text-white px-4 md:px-8 py-1 md:py-2 rounded"
              onClick={handleSellClick}
            >
              Sell
            </button>
          </>
        ) : (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 font-semibold text-base md:text-lg bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
                onClick={handleProfileClick}
              >
                <img src="https://avatars.githubusercontent.com/u/1?v=4" alt="profile" className="w-8 h-8 rounded-full" />
                {user.email || 'Profile'}
                {console.log(user.email)}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border">
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-100" onClick={() => { setDropdownOpen(false); navigate('/add-product'); }}>Add Product</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-100" onClick={() => { setDropdownOpen(false); navigate('/showproduct'); }}>Show Product</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-100" onClick={handleLogout}>Logout</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-100" onClick={() => { setDropdownOpen(false); navigate('/state'); }}>State</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-100" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>Profile</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
       {/* <Modal isModelOpen={isModelOpen } setIsModelOpen={setIsModelOpen}>
          {isLogin ? <Login openSignUp={openSignUp}/> : <Register openLogin={openLogin}/>}
        </Modal> */}
    </div>
  )
}

export default Headbar



