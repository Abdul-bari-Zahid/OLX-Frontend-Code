import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';


const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get(`${API}/api/categories`)
      .then(res => {
        setCategories(res.data || []);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {categories.length === 0 ? (
        <span className="text-gray-500">Koi category nahi mili.</span>
      ) : (
        categories.map(cat => (
          <Link
            key={cat.name || cat}
            to={`/category/${(cat.name || cat).toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-white shadow-md rounded-lg px-6 py-4 font-semibold hover:bg-blue-50 hover:shadow-lg transition-all text-center flex items-center justify-center min-h-[80px] group"
          >
            <div>
              {cat.icon && <img src={cat.icon} alt="" className="w-12 h-12 mx-auto mb-2 group-hover:scale-110 transition-transform" />}
              <span className="group-hover:text-blue-600 transition-colors">{cat.name || cat}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default CategoryList