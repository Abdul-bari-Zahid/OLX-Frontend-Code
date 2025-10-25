import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { useDispatch } from 'react-redux';
const Products = ({ search = '', filter = {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchText = search.trim().toLowerCase();
  const dispatch = useDispatch()
  useEffect(() => {
    const final =`${API}/api/pb/user/products`
    console.log(final)
    axios.get(final)
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = products.filter(product =>
    product.title?.toLowerCase().includes(searchText) ||
    (product.location && product.location.toLowerCase().includes(searchText)) ||
    (product.category && product.category.toLowerCase().includes(searchText))
  );
  if (filter.minPrice)
    filtered = filtered.filter(p => parseInt(p.price) >= parseInt(filter.minPrice));
  if (filter.maxPrice)
    filtered = filtered.filter(p => parseInt(p.price) <= parseInt(filter.maxPrice));
  if (filter.sort === 'low')
    filtered = [...filtered].sort((a, b) => parseInt(a.price) - parseInt(b.price));
  if (filter.sort === 'high')
    filtered = [...filtered].sort((a, b) => parseInt(b.price) - parseInt(a.price));

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Products</h2>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 h-full flex flex-col">
                <img
                  src={
                     product.images?.[0]
                       ? `${API.replace("/api", "")}/${product.images[0]}`
                       : "/no-image.jpg"
                   }
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-blue-700 font-bold text-lg mb-1">Rs {product.price}</p>
                  <h4 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{product.location}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;