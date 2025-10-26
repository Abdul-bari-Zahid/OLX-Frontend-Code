


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../App";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      
      // Store token
      const token = res.data.token;
      localStorage.setItem("token", token);
      
      // Prepare user data with token
      const userData = { ...res.data.user, token };
      
      // Update Redux store
      dispatch(loginAction(userData));
      
      toast.success("Login successful");
      navigate("/profile");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="border p-2 w-full mb-2"
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="border p-2 w-full mb-2"
        required
      />
      <button className="bg-blue-600 text-white w-full py-2 hover:bg-blue-700">Login</button>
      <p className="mt-1.5">
        Create an account <Link to="/register" className="underline text-blue-600 hover:text-blue-800">REGISTER</Link>
      </p>
    </form>
  );
}
export default  Login