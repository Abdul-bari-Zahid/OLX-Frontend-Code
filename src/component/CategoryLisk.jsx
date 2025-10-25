import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('/api/user/products')
      .then(res => {
        // products ki list se unique categories nikaal lo
        const products = res.data;
        const uniqueCats = [...new Set(products.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCats);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-center my-6">
      {categories.length === 0 ? (
        <span className="text-gray-500">Koi category nahi mili.</span>
      ) : (
        categories.map(cat => (
          <Link
            key={cat}
            to={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-white shadow rounded-lg px-4 py-2 font-semibold hover:bg-blue-100 transition"
          >
            {cat}
          </Link>
        ))
      )}
    </div>
  );
};

export default CategoryList