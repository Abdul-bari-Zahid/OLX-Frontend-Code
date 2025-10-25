import React from 'react'
import { FaInstagram, FaYoutube, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
   <footer className='bg-gray-800 text-white py-8 px-4 md:px-16 lg:px-24'>
    <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div >
        <h3 className='text-x font-semibold '>Dukhan Sabki.</h3>
        <p className='text-sm mt-4'>Your one-stop shop for the latest fashion trends.Shop with use & experience the best online shopping experience.</p>
      </div>
      <div className="flex flex-col md:items-center">
        <h4 className='text-lg font-semibold '>Quick Links</h4>
        <ul className='mt-4 space-y-2 text-sm'>
          <li><Link to="/" className='hover:underline'>Home</Link></li>
          <li><Link to="/shop" className='hover:underline'>Shop</Link></li>
          <li><Link to="/about"className='hover:underline'>About US</Link></li>
          <li><Link to="/contact" className='hover:underline'>Contact Us</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xl font-semibold">Follow US</h4>
        <div className="flex space-x-4 mt-4">
          <a href="" className="hover:text-gray-400  font-extrabold"><FaFacebook/></a>
          <a href="" className="hover:text-gray-400  font-extrabold"><FaInstagram/></a>
          <a href="" className="hover:text-gray-400  font-extrabold"><FaYoutube/></a>
          <a href="" className="hover:text-gray-400  font-extrabold"><FaGithub/></a>
          <a href="" className="hover:text-gray-400  font-extrabold"><FaLinkedin/></a>
        </div>
        <form className='flex items-center justify-center mt-8'>
          <input type="email" placeholder='Enter your email'  className="w-full p-2 rounded-l-lg bg-gray-800 border border-gray-600"/>
          <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded-r-lg">Subscribe</button>
        </form>
      </div>
    </div>


<div className="mt-8 border-t border-gray-700 pt-4 ">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
    <p>&copy; 2025 Dukhan Sabki. All rights reserved.</p>
    <div className="flex space-x-4 mt-4 md:mt-0">
      <a href="" className="hover:underline ">Privacy Policy</a>
      <a href="" className="hover:underline ">Terms of Service</a>
    </div>
  </div>
</div>

   </footer>
  )
}

export default Footer
