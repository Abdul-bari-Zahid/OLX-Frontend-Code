import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryList from '../component/CategoryLisk';
import PriceFilterSidebar from '../component/PriceFilterSidebar';
import { FaCog } from 'react-icons/fa';
import axios from 'axios';
const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState({ minPrice: '', maxPrice: '', sort: '' });
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    axios.get('/api/user/products')
      .then(res => {
        // slug se category nikaal lo
        const catName = slug.replace(/-/g, ' ');
        setCategoryName(catName.charAt(0).toUpperCase() + catName.slice(1));
        const filtered = res.data.filter(p =>
          p.category && p.category.toLowerCase().replace(/\s+/g, '-') === slug
        );
        setProducts(filtered);
      })
      .catch(() => setProducts([]));
  }, [slug]);

  const handleApply = () => {
    setFilter({ minPrice, maxPrice, sort });
    setFilterOpen(false);
  };

  let filteredProducts = products;
  if (filter.minPrice)
    filteredProducts = filteredProducts.filter(p => parseInt(p.price) >= parseInt(filter.minPrice));
  if (filter.maxPrice)
    filteredProducts = filteredProducts.filter(p => parseInt(p.price) <= parseInt(filter.maxPrice));
  if (filter.sort === 'low')
    filteredProducts = [...filteredProducts].sort((a, b) => parseInt(a.price) - parseInt(b.price));
  if (filter.sort === 'high')
    filteredProducts = [...filteredProducts].sort((a, b) => parseInt(b.price) - parseInt(a.price));

  if (!categoryName || products.length === 0)
    return <div className="text-center py-10">Category not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryList />
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mb-4"
          onClick={() => setFilterOpen(true)}
        >
          <FaCog />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6">{categoryName} Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 h-full flex flex-col">
              <img
                src={product.image || (product.images && product.images[0])}
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
      <PriceFilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        onApply={handleApply}
      />
    </div>
  );
};

export default CategoryPage;