import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    isMinimized: false,
    activeChat: null, // { productId, sellerId, sellerName, ... }
    conversations: [] // Optional: cache conversations list if needed global
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        openChat: (state, action) => {
            // action.payload: { productId, sellerId, sellerName, ... }
            state.isOpen = true;
            state.isMinimized = false;
            state.activeChat = action.payload;
        },
        closeChat: (state) => {
            state.isOpen = false;
            state.activeChat = null;
        },
        minimizeChat: (state) => {
            state.isMinimized = true;
        },
        maximizeChat: (state) => {
            state.isMinimized = false;
        }
    }
});

export const { openChat, closeChat, minimizeChat, maximizeChat } = chatSlice.actions;
export default chatSlice.reducer;
