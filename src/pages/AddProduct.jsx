import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../App";
import { useDispatch } from "react-redux";
const AddProduct = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("new");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // image previews for UI
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    // create object URLs
    const urls = images.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews(urls);
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u.url));
    };
  }, [images]);

  const removeImage = (index) => {
    const newImgs = [...images];
    newImgs.splice(index, 1);
    setImages(newImgs);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API}/api/categories`);
        if (mounted) setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err?.response?.data || err.message);
      }
    })();
    return () => { mounted = false };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && !localStorage.getItem('token')) {
      toast.error("Please login to add product");
      navigate("/login");
      return;
    }

    // basic validation
    if (!category) return toast.error('Please select a category');
    if (!name.trim()) return toast.error('Please enter product name');
    if (!description.trim()) return toast.error('Please enter description');
    const priceNum = Number(price);
    if (!isFinite(priceNum) || priceNum <= 0) return toast.error('Please enter a valid price');
    if (images.length === 0) return toast.error('Please upload at least one image');

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    formData.append("price", priceNum);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("condition", condition);
    formData.append("userId", user?._id || '');
    images.forEach((img) => formData.append("images", img));

    try {
      setSubmitting(true);
      const token = user?.token || localStorage.getItem('token');
      // fallback to localhost backend if API constant is missing
      const base = (typeof API === 'string' && API) ? API : "https://olx-backend-code.vercel.app/";
      const res = await axios.post(`${base}/api/user/product-multi`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message || "Product added successfully!");
      navigate('/profile');
    } catch (err) {
      console.error("Add Product Error:", err?.response?.data || err.message);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Error adding product';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Add a new product</h2>
        <p className="text-sm text-gray-500 mb-6">Fill in product details and upload clear photos to attract buyers.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left / main column */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block font-semibold mb-1">Product Category <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g. iPhone 14 Pro Max - 256GB"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Describe condition, included accessories and any defects"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Price (Rs) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="City, area (optional)"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Condition</label>
              <div className="flex items-center space-x-6">
                <label className={`inline-flex items-center px-3 py-2 border rounded cursor-pointer ${condition === 'new' ? 'border-blue-600 bg-blue-50' : ''}`}>
                  <input
                    type="radio"
                    value="new"
                    checked={condition === "new"}
                    onChange={(e) => setCondition(e.target.value)}
                    className="mr-2"
                  />
                  New
                </label>
                <label className={`inline-flex items-center px-3 py-2 border rounded cursor-pointer ${condition === 'used' ? 'border-blue-600 bg-blue-50' : ''}`}>
                  <input
                    type="radio"
                    value="used"
                    checked={condition === "used"}
                    onChange={(e) => setCondition(e.target.value)}
                    className="mr-2"
                  />
                  Used
                </label>
              </div>
            </div>
          </div>

          {/* Right column: images and submit */}
          <div className="md:col-span-1">
            <div className="border-dashed border-2 border-gray-200 rounded-md p-4 text-center">
              <label className="cursor-pointer inline-block w-full">
                <div className="text-sm text-gray-600 mb-2">Upload up to 5 images</div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 font-semibold">Select Images</div>
              </label>

              <div className="mt-4 text-sm text-gray-500">Preview</div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {previews.length === 0 && (
                  <div className="col-span-3 text-sm text-gray-400">No images selected</div>
                )}
                {previews.map((p, idx) => (
                  <div key={idx} className="relative">
                    <img src={p.url} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
