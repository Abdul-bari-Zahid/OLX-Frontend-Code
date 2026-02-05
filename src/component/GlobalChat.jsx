import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeChat, minimizeChat, maximizeChat } from '../redux/chatSlice';
import ProductChat from './ProductChat';
import './GlobalChat.css'; // We will create this CSS

const GlobalChat = () => {
    const { isOpen, isMinimized, activeChat } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    if (!isOpen || !activeChat) return null;

    return (
        <div className={`global-chat-container ${isMinimized ? 'minimized' : ''}`}>
            {isMinimized ? (
                <div className="chat-minimized-header" onClick={() => dispatch(maximizeChat())}>
                    <span>Chat with {activeChat.sellerName || 'Seller'}</span>
                    <button className="chat-control-btn" onClick={(e) => { e.stopPropagation(); dispatch(closeChat()); }}>✕</button>
                </div>
            ) : (
                <div className="chat-wrapper">
                    {/* We pass a custom onClose to ProductChat that minimizes or closes the global chat */}
                    <ProductChat
                        productId={activeChat.productId}
                        productName={activeChat.productName}
                        sellerInfo={{
                            _id: activeChat.sellerId,
                            name: activeChat.sellerName
                        }}
                        onClose={() => dispatch(closeChat())}
                        isGlobal={true}
                    />
                </div>
            )}
        </div>
    );
};

export default GlobalChat;
