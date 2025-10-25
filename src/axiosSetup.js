// src/axiosSetup.js
import axios from "axios";

export function setupAxios() {
  const token = localStorage.getItem("token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
