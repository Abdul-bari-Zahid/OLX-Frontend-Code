import { useEffect, useState } from 'react';
import { socket } from './socket';

/**
 * Custom hook to listen to socket events
 * @param {string} eventName - Name of the socket event
 * @param {function} callback - Callback function when event is triggered
 * @param {array} dependencies - Optional dependencies array
 */
export const useSocket = (eventName, callback, dependencies = []) => {
  useEffect(() => {
    socket.on(eventName, callback);
    
    return () => {
      socket.off(eventName, callback);
    };
  }, [eventName, callback, ...dependencies]);
};

/**
 * Custom hook to emit socket events
 * @returns {function} Function to emit events
 */
export const useSocketEmit = () => {
  return (eventName, data) => {
    socket.emit(eventName, data);
  };
};

/**
 * Custom hook to get socket connection status
 * @returns {boolean} True if socket is connected
 */
export const useSocketStatus = () => {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return connected;
};

export default socket;
