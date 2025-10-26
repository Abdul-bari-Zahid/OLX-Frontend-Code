import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { useDispatch } from 'react-redux';
const Products = ({ search = '', filter = {}, title = 'Latest Products', products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const searchText = search.trim().toLowerCase();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPage = async (p = 1, append = false) => {
    // if initialProducts passed, skip server fetch
    if (initialProducts) return;
    try {
      setLoading(true);
      const final = `${API}/api/user/products?page=${p}&limit=${limit}`;
      const res = await axios.get(final);
      const data = res.data || {};
      const fetched = Array.isArray(data.products) ? data.products : [];
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || p);
      if (append) setProducts(prev => [...prev, ...fetched]);
      else setProducts(fetched);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    if (!initialProducts) fetchPage(1, false);
  }, [initialProducts]);

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

  const handleLoadMore = () => {
    // append next page
    if (page < totalPages) {
      const next = page + 1;
      fetchPage(next, true);
    }
  };

  const handleGoToPage = (p) => {
    // navigate to page p (replace current products)
    fetchPage(p, false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const go = (e) => {
                // allow middle click / ctrl+click to open new tab
                if (e.metaKey || e.ctrlKey || e.button === 1) return;
                e.preventDefault();
                if (!product._id) return;
                navigate(`/product/${product._id}`);
              };

              return (
                <div
                  key={product._id}
                  role="link"
                  tabIndex={0}
                  onClick={go}
                  onKeyDown={(e) => { if (e.key === 'Enter') go(e); }}
                  className="block cursor-pointer"
                >
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group">
                    <div className="relative">
                      <img
                        src={
                          product.images?.[0]
                            ? `${API.replace("/api", "")}/${product.images[0]}`
                            : "/no-image.jpg"
                        }
                        alt={product.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.featured && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-blue-600 font-bold text-xl">Rs {Number(product.price).toLocaleString()}</p>
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">{product.category}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-500">{product.location}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
                        </span>
                        <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {/* Page numbers (show limited window) */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => handleGoToPage(p)}
                    className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Load more / Next */}
            <button
              onClick={handleLoadMore}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {page < totalPages ? 'Next (load more)' : 'No more products'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;