
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { socket } from '../socket.js';
import { useSelector } from 'react-redux';
import { API } from '../App.jsx';
import './ProductChat.css';

function ProductChat({ productId, productName, sellerInfo, onClose, isGlobal }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.user?.user);

  // normalize user id used across the app (login returns `id`, sometimes `_id`)
  const myId = user?.id || user?._id || user?.userId || user?.uid || null;

  useEffect(() => {
    if (!productId || !user) return;

    // Join the product chat room
    console.log('ProductChat: joining product room', productId);
    socket.emit('join-product-chat', productId);
    setLoading(true);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API}/api/messages/product/${productId}/user/${sellerInfo?._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const msgs = response.data.messages || [];
        setMessages(msgs);

        // mark unread messages as read (if I am receiver)
        try {
          const myUid = myId;
          const unread = msgs.filter(m => !m.read && String(m.receiverId) === String(myUid));
          if (unread.length) {
            const unreadIds = unread.map(m => m._id);
            await axios.post(`${API}/api/messages/mark-read`, { productId, otherUserId: sellerInfo?._id }, { headers: { Authorization: `Bearer ${token}` } });
            // notify sender(s) via socket
            socket.emit('message-read', { productId, readerId: myUid, senderId: sellerInfo?._id, messageIds: unreadIds });
            // update local messages
            setMessages(prev => prev.map(m => unreadIds.includes(String(m._id)) ? { ...m, read: true, status: 'read' } : m));
          }

          // Mark as delivered (if specific status is needed and not already read)
          // For now, if we mark read, it implies delivered.
        } catch (err) {
          console.warn('Error marking read on fetch', err);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    const handleMessage = (data) => {
      console.log('ProductChat: receive-product-message', data);
      // Only add messages for this product and relevant to this conversation
      if (data.productId === productId &&
        ((data.senderId === myId && data.receiverId === (sellerInfo?._id || sellerInfo?.id || sellerInfo?.userId)) ||
          (data.senderId === (sellerInfo?._id || sellerInfo?.id || sellerInfo?.userId) && data.receiverId === myId))) {

        setMessages((prev) => {
          // De-duplicate in case of race conditions
          if (prev.find(m => m._id === data._id)) return prev;
          return [...prev, data];
        });

        // if current user is the receiver and chat is open
        const currentUserId = myId;
        if (data.receiverId === currentUserId) {
          // Emit 'delivered' immediately as we received it
          socket.emit('message-delivered', { productId, receiverId: currentUserId, senderId: data.senderId, messageIds: [data._id] });

          // Mark as 'read' immediately since chat is open
          (async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.post(`${API}/api/messages/mark-read`, { productId, otherUserId: sellerInfo?._id }, { headers: { Authorization: `Bearer ${token}` } });
              socket.emit('message-read', { productId, readerId: currentUserId, senderId: data.senderId, messageIds: [data._id] });
              setMessages(prev => prev.map(m => (String(m._id) === String(data._id) ? { ...m, read: true, status: 'read' } : m)));
            } catch (err) {
              console.warn('mark-read on receive error', err);
            }
          })();
        }
      }
    };

    socket.on('receive-product-message', handleMessage);
    // Listen for message errors
    const handleMessageError = (err) => {
      console.error('ProductChat: message-error', err);
    };
    socket.on('message-error', handleMessageError);
    // typing indicator handler
    const handleTyping = (payload) => {
      if (!payload || payload.productId !== productId) return;
      const fromSeller = String(payload.senderId) === String(sellerInfo?._id || sellerInfo?.id || sellerInfo?.userId);
      if (fromSeller) setOtherTyping(!!payload.isTyping);
    };
    socket.on('typing', handleTyping);

    // read receipts handler
    const handleRead = (payload) => {
      if (!payload || payload.productId !== productId) return;
      const ids = payload.messageIds || [];
      if (!ids.length) return;
      setMessages(prev => prev.map(m => ids.includes(String(m._id)) ? { ...m, read: true, status: 'read' } : m));
    };
    socket.on('message-read', handleRead);

    // delivery receipts handler
    const handleDelivered = (payload) => {
      if (!payload || payload.productId !== productId) return;
      const ids = payload.messageIds || [];
      if (!ids.length) return;
      setMessages(prev => prev.map(m => ids.includes(String(m._id)) && m.status !== 'read' ? { ...m, status: 'delivered' } : m));
    };
    socket.on('message-delivered', handleDelivered);

    // presence handlers
    const handleUserOnline = (p) => {
      try {
        if (!p) return;
        const uid = p.userId || p.user || p.id;
        if (!uid) return;
        if (String(uid) === String(sellerInfo?._id || sellerInfo?.id)) setOtherOnline(true);
      } catch (err) {
        console.error('handleUserOnline error', err);
      }
    };
    const handleUserOffline = (p) => {
      try {
        if (!p) return;
        const uid = p.userId || p.user || p.id;
        if (!uid) return;
        if (String(uid) === String(sellerInfo?._id || sellerInfo?.id)) setOtherOnline(false);
      } catch (err) {
        console.error('handleUserOffline error', err);
      }
    };
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);

    // Check initial online status
    const targetId = sellerInfo?._id || sellerInfo?.id || sellerInfo?.userId;
    if (targetId) {
      console.log('ProductChat: checking status for', targetId);
      socket.emit('check-status', targetId, (res) => {
        console.log('ProductChat: check-status result', res);
        if (res && res.online) setOtherOnline(true);
      });
    }

    return () => {
      socket.emit('leave-product-chat', productId);
      console.log('ProductChat: leaving product room', productId);
      socket.off('receive-product-message', handleMessage);
      socket.off('message-error', handleMessageError);
      socket.off('typing', handleTyping);
      socket.off('message-read', handleRead);
      socket.off('message-delivered', handleDelivered);
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [productId, user, sellerInfo?._id]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !user || !sellerInfo) return;

    const sellerId = sellerInfo?._id || sellerInfo?.id || sellerInfo?.userId || null;
    const senderName = user?.name || user?.firstName || user?.email || 'User';

    const messageData = {
      productId,
      senderId: myId,
      receiverId: sellerId,
      senderName,
      text: messageText
    };

    // Emit via socket with acknowledgement callback
    console.log('ProductChat: sending message', messageData);
    socket.emit('send-product-message', messageData, (ack) => {
      try {
        console.log('ProductChat: send-product-message ack', ack);
      } catch (e) {
        console.error('ProductChat ack handler error', e);
      }
    });

    // Clear input
    setMessageText('');

    // Optimistic update
    setMessages((prev) => [...prev, {
      ...messageData,
      createdAt: new Date(),
      _id: Date.now() + Math.random(), // proper temporary ID to avoid key clash
      read: false,
      status: 'sent'
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper for ticks
  const renderTicks = (msg) => {
    if (msg.senderId !== myId) return null;

    const isRead = msg.read || msg.status === 'read';
    const isDelivered = msg.status === 'delivered';
    // sent is default

    if (isRead) {
      // Double Blue Tick
      return <span style={{ color: '#3b82f6', marginLeft: 4 }}>✔✔</span>;
    }
    if (isDelivered) {
      // Double Grey/Black Tick
      return <span style={{ color: '#000000', marginLeft: 4 }}>✔✔</span>;
    }
    // Single Tick
    return <span style={{ color: '#000000', marginLeft: 4 }}>✔</span>;
  };

  return (
    <div className={`product-chat-container ${isGlobal ? 'global-mode' : ''}`}>
      <div className="chat-header">
        <div className="chat-info">
          <h3>{productName}</h3>
          <p className="seller-name">
            {sellerInfo?.name || 'Seller'}
            <span style={{ marginLeft: 8, fontSize: 12, color: otherOnline ? '#059669' : '#6b7280' }}>
              {otherTyping ? 'Typing...' : (otherOnline ? 'Online' : 'Offline')}
            </span>
          </p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="messages-container">
        {loading ? (
          <p className="loading">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`message ${msg.senderId === myId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p className="message-text">{msg.text}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {renderTicks(msg)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            // emit typing-start 
            const sellerId = sellerInfo?._id || sellerInfo?.id || sellerInfo?.userId;
            socket.emit('typing-start', { productId, senderId: myId, receiverId: sellerId });
            if (window.__typingTimeout) clearTimeout(window.__typingTimeout);
            window.__typingTimeout = setTimeout(() => {
              socket.emit('typing-stop', { productId, senderId: myId, receiverId: sellerId });
            }, 1000);
          }}
          onKeyPress={handleKeyPress}
          rows="1"
        />
        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ProductChat;
