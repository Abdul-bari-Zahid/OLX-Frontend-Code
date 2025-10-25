
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../App";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading your profile...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-xl shadow-md mb-10">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src="/user-avatar.png"
            alt="user"
            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
          />
          <p className="mt-3 text-blue-600 font-semibold text-sm">
            {products.length} published ads
          </p>
          <button
            onClick={handleShare}
            className="mt-2 flex items-center gap-2 border px-4 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 text-sm"
          >
            <FaShareAlt /> Share Profile
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h1>
          <div className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />{" "}
            {user?.location || "Pakistan"}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="border-b mb-6 pb-2 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Published Ads</h2>
        <span className="text-sm text-gray-500">
          Showing {products.length} Ads
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          You haven’t uploaded any products yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border relative ${
                p.blocked ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
              }`}
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={
                    p.images?.[0]
                      ? `${API.replace("/api", "")}/${p.images[0]}`
                      : "/no-image.jpg"
                  }
                  alt={p.title}
                  className="w-full h-56 object-cover"
                />
                {p.blocked && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded">
                    🔒 Blocked by Admin
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {p.description}
                </p>

                <p className="text-blue-700 font-semibold mb-2">
                  Rs {p.price.toLocaleString()}
                </p>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {p.location || "Unknown"}
                  </p>
                  <button
                    onClick={() =>
                      window.open(`/product/${p._id}`, "_blank")
                    }
                    className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    <FiExternalLink /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileProducts;
