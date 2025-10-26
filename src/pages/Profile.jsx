
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../App";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaShareAlt, FaEnvelope, FaTrash } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const ProfileProducts = () => {
  const [products, setProducts] = useState([]);
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
        setProducts(res.data.products || []);
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
      setProducts((prev) => prev.filter((x) => x._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      console.error("Delete error", err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading your profile...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="relative">
        <div className="h-40 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg" />
        <div className="-mt-12 flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-md">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || "/user-avatar.png"}
                alt="user"
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
              />
              <div className="absolute -bottom-2 right-0 bg-white rounded-full p-1 shadow">
                <button
                  onClick={handleShare}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
                  title="Share profile"
                >
                  <FaShareAlt className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  <FaMapMarkerAlt className="text-blue-500" /> {user?.location || "Pakistan"}
                </span>
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                  <FaEnvelope /> Message
                </button>
              </div>
            </div>
          </div>

          {/* Spacer / Stats */}
          <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{products.length}</div>
              <div className="text-xs text-gray-500">Published Ads</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{user?.followers || 0}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{user?.rating || "—"}</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product List heading */}
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Published Ads</h2>
        <span className="text-sm text-gray-500">Showing {products.length} Ads</span>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <p className="mb-4 text-lg">You haven’t uploaded any products yet.</p>
          <a href="/add-product" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add your first product</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <article
              key={p._id}
              className={`rounded-xl overflow-hidden shadow transition-transform transform hover:-translate-y-1 bg-white border ${p.blocked ? 'ring-2 ring-red-200' : 'border-gray-100'}`}
            >
              <div className="relative">
                <img
                  src={p.images?.[0] ? `${API.replace("/api", "")}/${p.images[0]}` : "/no-image.jpg"}
                  alt={p.title}
                  className="w-full h-56 object-cover"
                />

                {/* Price badge */}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-md px-3 py-1 text-sm font-semibold text-blue-700">
                  Rs {p.price ? Number(p.price).toLocaleString() : "—"}
                </div>

                {p.blocked && (
                  <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center">
                    <div className="text-red-600 font-semibold bg-white/80 px-3 py-1 rounded">Blocked by Admin</div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">{p.location || 'Unknown'}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`/product/${p._id}`, "_blank")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      <FiExternalLink /> View
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                      title="Delete product"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileProducts;
