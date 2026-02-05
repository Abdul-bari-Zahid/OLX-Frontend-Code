// Use the browser client for socket.io to avoid pulling server-side code (which references Node globals like Buffer)
import { io } from "socket.io-client";

const URL = import.meta?.env?.VITE_API || "http://localhost:3005";

// Include JWT token in the socket auth payload so server can verify the user on connect
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  auth: {
    token
  }
});

// Log connection events for debugging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
  const userId = localStorage.getItem('userId');
  if (userId) {
    socket.emit('identify', userId);
  }
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("⚠️ Socket connection error:", error);
});

// Listen for product messages
socket.on("product-message", (data) => {
  console.log("📨 Product message received:", data);
});

// Listen for general messages
socket.on("message", (data) => {
  console.log("💬 Message received:", data);
});

export default socket;