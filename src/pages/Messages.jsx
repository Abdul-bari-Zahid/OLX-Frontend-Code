import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { API } from "../App.jsx";
import ProductChat from "../component/ProductChat.jsx";
import { socket } from '../socket.js';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MessagesPage = () => {
  const location = useLocation();
  const product = location.state?.product || null;

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedForChat, setSelectedForChat] = useState(null);
  const user = useSelector((state) => state.user?.user);

  // If navigation provided state (from notification), auto-open the relevant product chat
  useEffect(() => {
    if (location.state && location.state.productId) {
      const { productId, senderId, senderName } = location.state;
      const autoChat = {
        id: productId,
        otherUserId: senderId,
        otherUserName: senderName || senderId,
        productTitle: `Product ${productId}`,
      };
      // avoid opening duplicate chat for same product+user
      const current = selectedForChat || {};
      if (!(current.id === productId && current.user === senderId)) {
        setSelectedChat(autoChat);
        setSelectedForChat({ id: productId, user: senderId, productTitle: autoChat.productTitle });
        setChatOpen(true);
      }
    }
  }, [location.state]);

  // Fetch conversations for current user
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/api/messages/conversations`, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data.conversations || [];

        // Normalize into conversation objects for UI
        const normalized = data.map((c) => {
          const last = c.lastMessageObj || {};
          const otherId = c.otherUserId || (last.senderId === (user?._id || user?.id) ? last.receiverId : last.senderId);
          const otherName = last.senderId === (user?._id || user?.id) ? (last.receiverName || last.receiverId) : (last.senderName || last.senderId);
          return {
            id: c.productId,
            productId: c.productId,
            otherUserId: otherId,
            otherUserName: otherName,
            lastMessage: last.text || '',
            lastMessageAt: last.createdAt,
            unreadCount: c.unreadCount || 0,
            productTitle: `Product ${c.productId}`
          };
        });
        setConversations(normalized);
        if (!selectedChat && normalized.length > 0) {
          setSelectedChat(normalized[0]);
          setSelectedForChat({ id: normalized[0].productId, user: normalized[0].otherUserId, productTitle: normalized[0].productTitle });
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    if (user) fetchConversations();
  }, [user]);

  // Listen for socket notifications to update inbox
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (payload) => {
      try {
        const { productId, senderId, senderName, text } = payload || {};
        if (!productId || !senderId) return;
        setConversations(prev => {
          const key = `${productId}-${senderId}`;
          const found = prev.find(c => String(c.productId) === String(productId) && String(c.otherUserId) === String(senderId));
          if (found) {
            return prev.map(c => (c === found ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: text || c.lastMessage } : c));
          }
          // prepend new conversation
          const newConv = {
            id: productId,
            productId,
            otherUserId: senderId,
            otherUserName: senderName || senderId,
            lastMessage: text || '',
            lastMessageAt: new Date(),
            unreadCount: 1,
            productTitle: `Product ${productId}`
          };
          return [newConv, ...prev];
        });
      } catch (err) {
        console.error('notification handler error', err);
      }
    };

    const handleRead = (payload) => {
      try {
        const { productId, readerId, messageIds } = payload || {};
        if (!productId || !readerId) return;
        setConversations(prev => prev.map(c => {
          if (String(c.productId) === String(productId) && String(c.otherUserId) !== String(readerId) && String(c.otherUserId) === String(readerId)) {
            return { ...c, unreadCount: 0 };
          }
          // if current user is sender and readerId equals otherUserId, clear unread
          if (String(c.productId) === String(productId) && String(c.otherUserId) === String(readerId)) {
            return { ...c, unreadCount: 0 };
          }
          return c;
        }));
      } catch (err) {
        console.error('read handler error', err);
      }
    };

    socket.on('new-message-notification', handleNotification);
    socket.on('message-read', handleRead);

    return () => {
      socket.off('new-message-notification', handleNotification);
      socket.off('message-read', handleRead);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "Me", text: newMsg }],
    }));
    setNewMsg("");
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/3 border-r">
        <div className="p-3 border-b font-bold">INBOX</div>
        <div className="p-2 text-sm text-gray-600 flex gap-2 border-b">
          <button className="px-2 py-1 rounded bg-gray-200">All</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">
            Unread Chats
          </button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">
            Important
          </button>
        </div>
        {conversations.map((chat) => (
          <div
            key={`${chat.id}-${chat.otherUserId}`}
            className={`p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 ${
              selectedChat?.id === chat.id ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              const current = selectedForChat || {};
              // If same product+user already open, do nothing
              if (current.id === chat.productId && current.user === chat.otherUserId) return;
              // otherwise open this conversation (if same user but different product, this will open new product chat)
              setSelectedChat(chat);
              setSelectedForChat({ id: chat.productId, user: chat.otherUserId, productTitle: chat.productTitle });
              setChatOpen(true);
            }}
          >
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{chat.otherUserName || chat.otherUserId}</p>
              <p className="text-xs text-gray-500">{chat.productTitle}</p>
            </div>
            {chat.unreadCount > 0 && (
              <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT: CHAT BOX - embed ProductChat directly on the page */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ProductChat
            productId={selectedForChat?.id || selectedChat.id}
            productName={selectedForChat?.productTitle || selectedChat.productTitle}
            sellerInfo={{ _id: selectedForChat?.user || selectedChat.otherUserId, name: selectedChat.otherUserName || selectedForChat?.user }}
            onClose={() => {
              setSelectedChat(null);
              setSelectedForChat(null);
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
