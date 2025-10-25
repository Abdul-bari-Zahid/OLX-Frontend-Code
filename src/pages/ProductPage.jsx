import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    // slug format: category-slug-productId OR just productId
    let id = slug;
    if (slug.includes('-')) {
      const lastDash = slug.lastIndexOf('-');
      id = slug.substring(lastDash + 1);
    }const final = `${API}/api/pb/user/product/${id}`
    console.log(final)
    axios.get(final)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
    // Related products
    axios.get(`${API}/api/pb/user/products/`)
      .then(res => {
        if (Array.isArray(res.data)) setProducts(res.data);
        else setProducts([]);
      })
      .catch(() => setProducts([]));
  }, [slug]);

  const handleNumber = (e) => {
    if (!show) {
      e.target.textContent = product?.number || 'N/A';
      e.target.disabled = false;
      setShow(true);
    } else {
      e.target.textContent = 'Show phone number';
      e.target.disabled = false;
      setShow(false);
    }
  };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  // Related products: same category, exclude current product
  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 pt-8">
    
        <div className="flex-1">
           
          <div className="bg-white rounded-lg shadow p-4 flex justify-center items-center mb-4">
            <img 
             src={
                                 product.images?.[0]
                                   ? `${API.replace("/api", "")}/${product.images[0]}`
                                   : "/no-image.jpg"
                               }
             className="h-96 object-contain rounded" />
          </div>
           
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <p className="text-2xl font-bold text-blue-700 mb-2">Rs {product.price}</p>
            <h1 className="text-xl font-semibold mb-2">{product.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" />
              </svg>
              {product.location}
            </div>
            <div className="text-xs text-gray-400">{product.time}</div>
          </div>
           
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-3">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-gray-600">Category:</div>
              <div className="col-span-1 md:col-span-2">{product.category}</div>
              <div className="font-semibold text-gray-600">Location:</div>
              <div className="col-span-1 md:col-span-2">{product.location}</div>
              <div className="font-semibold text-gray-600">Ad ID:</div>
              <div className="col-span-1 md:col-span-2">{slug}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-3">Description</h2>
            <p className="text-gray-700">
              {product.title} <br />
              Location: {product.location} <br />
              {product.description}
            </p>
          </div>
        </div>
         
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center mb-4">
              <img
                src="https://avatars.githubusercontent.com/u/1?v=4"
                alt="User"
                className="w-12 h-12 rounded-full border mr-3"
              />
              <div>
                <div className="font-semibold">Posted by {product.Posted}</div>
                <div className="text-xs text-gray-500">Member Since 2025</div>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded font-semibold mb-2 hover:bg-green-700" onClick={(e) => handleNumber(e)}>
              Show phone number
            </button>
            <button
            className="w-full border py-2 rounded font-semibold mb-2 hover:bg-gray-100"
            onClick={() =>
              navigate("/messages", {
                state: { product },
              })
            }
          >
            Chat
          </button>
            <div className="text-xs text-gray-400 mt-2">Ad ID: {slug}</div>
          </div>
        </div>
      </div>

       
      <div className="container mx-auto mt-10">
        <h2 className="text-lg font-bold mb-4">Related ads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {related.map(r => (
            <Link
              key={r._id}
              to={`/product/${r._id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition">
                <img 
                  src={
                                 product.images?.[0]
                                   ? `${API.replace("/api", "")}/${product.images[0]}`
                                   : "/no-image.jpg"
                               }
                 className="h-40 w-full object-cover rounded mb-2" />
                <p className="text-blue-700 font-bold">Rs {product.price}</p>
                <div className="font-semibold">{product.title}</div>
                <div className="text-xs text-gray-500">{product.location}</div>
                <div className="text-xs text-gray-400">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    
      <div className="container mx-auto mt-10">
        <h2 className="text-lg font-bold mb-2">Your safety matters to us!</h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
          <li>Only meet in public / crowded places such as metro stations and malls.</li>
          <li>Never go alone to meet a buyer / seller; always take someone with you.</li>
          <li>Check and inspect the product properly before purchasing it.</li>
          <li>Never pay / transfer any money in advance before inspecting the product.</li>
        </ul>
      </div>
      
    </div>
  )
}

export default ProductDetails