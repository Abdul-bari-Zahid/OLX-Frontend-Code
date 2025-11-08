import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API}/api/products/${id}`);
        setProduct(res.data);

        const relatedRes = await axios.get(`${API}/api/user/products`);
        const data = Array.isArray(relatedRes.data)
          ? relatedRes.data
          : relatedRes.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err.response?.data?.message || 'Could not load product');
        toast.error('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  const handleNumber = (e) => {
    if (!show) {
      e.target.textContent = product?.number || 'N/A';
      setShow(true);
    } else {
      e.target.textContent = 'Show phone number';
      setShow(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 text-center py-10">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 text-center py-10">
        <div className="text-red-600 mb-4">{error || 'Product not found'}</div>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 pt-8">

        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="relative flex items-center justify-center">
              <button
                onClick={() =>
                  setCurrentIndex(i =>
                    (i - 1 + (product.images?.length || 1)) %
                    (product.images?.length || 1)
                  )
                }
                className="absolute left-2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              >
                ‹
              </button>

              <img
                src={
                  product.images?.length
                    ? `${API.replace('/api', '')}/${product.images[currentIndex]}`
                    : '/no-image.jpg'
                }
                alt={product.title}
                className="h-96 object-contain rounded"
              />

              <button
                onClick={() =>
                  setCurrentIndex(i =>
                    (i + 1) % (product.images?.length || 1)
                  )
                }
                className="absolute right-2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              >
                ›
              </button>
            </div>

            {product.images?.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded overflow-hidden border ${
                      idx === currentIndex ? 'border-blue-600' : 'border-gray-200'
                    }`}
                    style={{ width: 96, height: 64 }}
                  >
                    <img
                      src={`${API.replace('/api', '')}/${img}`}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <p className="text-2xl font-bold text-blue-700 mb-2">Rs {product.price}</p>
            <h1 className="text-xl font-semibold mb-2">{product.title}</h1>
            <div className="text-gray-500 text-sm mb-2">{product.location}</div>
            <div className="text-xs text-gray-400">{product.time}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-3">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-gray-600">Category:</div>
              <div className="font-semibold text-gray-600">Ad ID:</div>
              <div className="font-semibold text-gray-600">Location:</div>
              <div>{product.category}</div>
               <div>{product._id}</div>
              <div>{product.location}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-3">Description</h2>
            <p className="text-gray-700">{product.description}</p>
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
            <button
              className="w-full bg-green-600 text-white py-2 rounded font-semibold mb-2 hover:bg-green-700"
              onClick={handleNumber}
            >
              Show phone number
            </button>
            <button
              className="w-full border py-2 rounded font-semibold mb-2 hover:bg-gray-100"
              onClick={() => navigate('/messages', { state: { product } })}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-10">
        <h2 className="text-lg font-bold mb-4">Related ads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {related.map(r => (
            <Link key={r._id} to={`/product/${r._id}`} className="block">
              <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition">
                <img
                  src={
                    r.images?.[0]
                      ? `${API.replace('/api', '')}/${r.images[0]}`
                      : '/no-image.jpg'
                  }
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <p className="text-blue-700 font-bold">Rs {r.price}</p>
                <div className="font-semibold">{r.title}</div>
                <div className="text-xs text-gray-500">{r.location}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
