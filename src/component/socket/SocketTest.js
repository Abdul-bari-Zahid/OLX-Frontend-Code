import React, { useState, useEffect } from 'react';
import { socket } from '../../socket.js';

function SocketTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connection event handlers
    const handleConnect = () => {
      setIsConnected(true);
      console.log('✅ Connected to server');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('❌ Disconnected from server');
    };

    const handleMessage = (data) => {
      console.log('📨 Message received:', data);
      setMessages((prev) => [...prev, data]);
    };

    const handleError = (error) => {
      console.error('⚠️ Socket error:', error);
    };

    // Register listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('message', handleMessage);
    socket.on('connect_error', handleError);

    // Check initial connection status
    if (socket.connected) {
      setIsConnected(true);
    }

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('message', handleMessage);
      socket.off('connect_error', handleError);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { text: message, timestamp: new Date() });
      setMessage('');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Socket.IO Test</h2>
      
      <div className="mb-4 p-3 rounded" style={{ backgroundColor: isConnected ? '#d4edda' : '#f8d7da' }}>
        <span className="text-lg font-semibold">
          Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Send Message</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border px-3 py-2 rounded"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Messages ({messages.length})</h3>
        <div className="bg-gray-100 p-3 rounded h-48 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages yet</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="text-sm mb-2 p-2 bg-white rounded border-l-2 border-blue-500">
                <p className="text-gray-800">{msg.data?.text || JSON.stringify(msg)}</p>
                <p className="text-xs text-gray-500">{new Date(msg.data?.timestamp).toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SocketTest;
