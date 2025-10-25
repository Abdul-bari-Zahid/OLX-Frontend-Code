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
      const finalapi = (`${API}/api/user/product-multi`)
      console.log(finalapi)
      const res = await axios.post(`${API}/api/user/product-multi`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("add product response:", res.data);
      toast.success(res.data.message || "Product added successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Add Product Error:", err.response?.data || err.message);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Error adding product';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Product Category</label>
         <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border p-2 rounded"
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
          <label className="block font-semibold mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product description"
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product price"
          />
        </div>
         <div>
          <label className="block font-semibold mb-1">Location</label>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product description"
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold mb-1">Condition</label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                value="new"
                checked={condition === "new"}
                onChange={(e) => setCondition(e.target.value)}
              />
              New
            </label>
            <label>
              <input
                type="radio"
                value="used"
                checked={condition === "used"}
                onChange={(e) => setCondition(e.target.value)}
              />
              Used
            </label>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
