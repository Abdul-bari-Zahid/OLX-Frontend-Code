// import React from 'react'
// import Products from './Products.jsx'

// const search = ''
// const filter = { blocked: false }
// export const Showproduct = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../App";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaShareAlt, FaEnvelope, FaTrash } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const Showproduct = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/user/my-products/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.user) setUser(res.data.user);
        const list = res.data.products || [];
        setProducts(list);
        setSelected(list[0] || null);
      } catch (err) {
        console.error("Error loading products", err);
        toast.error(err?.response?.data?.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/user/product/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts((prev) => {
        const next = prev.filter((x) => x._id !== id);
        // if deleted item was selected, update selected to first item or null
        if (selected && selected._id === id) {
          setSelected(next[0] || null);
        }
        return next;
      });
      toast.success("Product deleted");
    } catch (err) {
      console.error("Delete error", err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading products...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <div className="text-sm text-gray-500">Showing {products.length} Ads</div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <p className="mb-4 text-lg">You haven’t uploaded any products yet.</p>
          <a href="/add-product" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add your first product</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: thumbnails */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-3">Your Ads</h2>
              <ul className="space-y-3 max-h-[72vh] overflow-auto">
                {products.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => setSelected(p)}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition ${selected && selected._id === p._id ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                  >
                    <img src={p.images?.[0] ? `${API.replace('/api','')}/${p.images[0]}` : '/no-image.jpg'} alt={p.title} className="w-16 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800 truncate">{p.title}</div>
                      <div className="text-xs text-gray-500">Rs {p.price ? Number(p.price).toLocaleString() : '—'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="md:flex md:gap-6">
                  <div className="md:w-1/2">
                    <img src={(selected._main ? `${API.replace('/api','')}/${selected._main}` : (selected.images?.[0] ? `${API.replace('/api','')}/${selected.images[0]}` : '/no-image.jpg'))} alt={selected.title} className="w-full h-72 object-cover rounded" />
                    {selected.images && selected.images.length > 1 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {selected.images.map((img, idx) => (
                          <img key={idx} src={`${API.replace('/api','')}/${img}`} alt={`${selected.title}-${idx}`} className="w-full h-16 object-cover rounded cursor-pointer" onClick={() => setSelected((s) => ({ ...s, _main: img }))} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:w-1/2 mt-4 md:mt-0">
                    <h3 className="text-2xl font-bold text-gray-900">{selected.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-2xl font-extrabold text-blue-600">Rs {selected.price ? Number(selected.price).toLocaleString() : '—'}</div>
                      <div className="text-sm text-gray-500">{selected.category}</div>
                    </div>

                    <p className="mt-4 text-gray-700 whitespace-pre-line">{selected.description}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="text-sm text-gray-500 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> {selected.location || 'Unknown'}</div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <a href={`/product/${selected._id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md">View public</a>
                      <button onClick={() => { if (window.confirm('Delete this product?')) handleDelete(selected._id); }} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                      <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">Share</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">Select a product to view details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Showproduct;
