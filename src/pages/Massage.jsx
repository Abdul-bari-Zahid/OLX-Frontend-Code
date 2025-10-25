import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const MessagesPage = () => {
  const location = useLocation();
  const product = location.state?.product || null;

  const inbox = [
    {
      id: product ? product.id : 1,
      user: product?.Posted || "all",
      productTitle: product ? product.title : "iPhone 12 Pro Max 256GB",
      price: product ? product.price : "61,500",
      number: product ? product.number : "03248667902",
      // image: product ? product.image : "https://via.placeholder.com/80",
      image : product.image?.[0]
                      ? `${API.replace("/api", "")}/${product.image[0]}`
                      : "/no-image.jpg",
  category: product?.category || "mobiles",
      messages: [
        { from: "all", text: "Hello, is this available?" },
        { from: "Me", text: "Yes, it's available." },
      ],
    },
  ];
console.log(inbox)
  const [selectedChat, setSelectedChat] = useState(inbox[0]);
  const [newMsg, setNewMsg] = useState("");

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
      {/* LEFT: INBOX LIST */}
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
        {inbox.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 ${
              selectedChat?.id === chat.id ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{chat.user}</p>
              <p className="text-xs text-gray-500">
                {chat.productTitle} {chat.number}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: CHAT BOX */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* TOP BAR */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-100">
              <div className="flex items-center gap-2">
                <img
                  src="https://avatars.githubusercontent.com/u/1?v=4"
                  alt="poster"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-bold">{selectedChat.user}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.productTitle} {selectedChat.number}
                  </p>
                </div>
              </div>
              <button className="text-gray-500">X</button>
            </div>

            {/* AD PREVIEW */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedChat.image}
                  alt={selectedChat.productTitle}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {selectedChat.productTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    Rs {selectedChat.price}
                  </p>
                </div>
              </div>

              {/* ✅ Only one "View Ad" button */}
              <Link
                to={`/product/${selectedChat.category.toLowerCase()}-${selectedChat.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                View Ad
              </Link>
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {selectedChat.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    msg.from === "Me" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.from === "Me"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* INPUT BOX */}
            <div className="p-3 border-t bg-white">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <button className="font-semibold text-gray-600">
                  QUESTIONS
                </button>
                <button className="font-semibold text-gray-600">OFFER</button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
                >
                  ➤
                </button>
              </div>
            </div>
          </>
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
