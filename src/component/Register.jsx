

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../App";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        phone,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="border p-2 w-full mb-2"/>
      <input placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} className="border p-2 w-full mb-2"/>
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 w-full mb-2"/>
      <input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} className="border p-2 w-full mb-2"/>
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 w-full mb-2"/>
      <button className="bg-blue-600 text-white w-full py-2" disabled={loading}>Register</button>
      <p className="mt-1.5">Already have an account <Link to="/login" className="underline">LOGIN</Link></p>

    </form>
  );
}
