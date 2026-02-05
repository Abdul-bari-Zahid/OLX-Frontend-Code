import React, { useState } from 'react';
import { useSocket, useSocketEmit, useSocketStatus } from '../useSocket';

/**
 * Example Component: Real-time Message System
 * 
 * This component demonstrates:
 * 1. Listening to socket events with useSocket
 * 2. Emitting socket events with useSocketEmit
 * 3. Checking socket connection status with useSocketStatus
 */

export default function SocketExample() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const connected = useSocketStatus();
  const emit = useSocketEmit();

  // Listen for incoming messages
  useSocket('message', (data) => {
    console.log('📨 New message:', data);
    setMessages(prev => [...prev, { ...data, timestamp: new Date().toLocaleTimeString() }]);
  });

  // Listen for product messages
  useSocket('product-message', (data) => {
    console.log('🛍️ Product message:', data);
    setMessages(prev => [...prev, { ...data, type: 'product', timestamp: new Date().toLocaleTimeString() }]);
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Emit message to server
    emit('message', { 
      text: inputValue,
      timestamp: new Date().toISOString()
    });
    
    setInputValue('');
  };

  const handleSendProductMessage = () => {
    if (!inputValue.trim()) return;
    
    emit('product-message', {
      productId: '123', // Replace with actual product ID
      message: inputValue
    });
    
    setInputValue('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Socket.IO Example</h2>
      
      {/* Connection Status */}
      <div style={{ 
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: connected ? '#d4edda' : '#f8d7da',
        borderRadius: '4px',
        color: connected ? '#155724' : '#721c24'
      }}>
        {connected ? '🟢 Connected to Server' : '🔴 Disconnected from Server'}
      </div>

      {/* Messages Display */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '4px',
        height: '300px',
        overflowY: 'auto',
        marginBottom: '15px',
        border: '1px solid #ddd'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#999' }}>No messages yet...</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: '10px',
              padding: '8px',
              backgroundColor: '#fff',
              borderLeft: msg.type === 'product' ? '4px solid #007bff' : '4px solid #28a745',
              borderRadius: '2px'
            }}>
              <small style={{ color: '#999' }}>{msg.timestamp}</small>
              <p style={{ margin: '5px 0 0 0' }}>
                {msg.text || msg.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input and Buttons */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            marginBottom: '10px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSendMessage}
          disabled={!connected}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: connected ? 'pointer' : 'not-allowed',
            opacity: connected ? 1 : 0.5
          }}
        >
          Send Message
        </button>

        <button
          onClick={handleSendProductMessage}
          disabled={!connected}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: connected ? 'pointer' : 'not-allowed',
            opacity: connected ? 1 : 0.5
          }}
        >
          Send Product Message
        </button>
      </div>

      {/* Info Section */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>📚 How to use Socket.IO in your component:</h4>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
{`import { useSocket, useSocketEmit, useSocketStatus } from './useSocket';

export function MyComponent() {
  const connected = useSocketStatus(); // Check connection
  const emit = useSocketEmit(); // Send events
  
  // Listen to events
  useSocket('message', (data) => {
    console.log('Received:', data);
  });
  
  // Emit events
  emit('message', { text: 'Hello' });
  
  return <div>{connected ? 'Connected' : 'Disconnected'}</div>;
}`}
        </pre>
      </div>
    </div>
  );
}
