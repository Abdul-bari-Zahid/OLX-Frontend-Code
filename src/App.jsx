import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Components & Pages
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductPage.jsx";
import Footer from "./component/Footer.jsx";
import Headbar from "./component/Headbar.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import Shop from "./pages/Shop.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import PrivateRoute from "./component/PrivateRoute.jsx";
import { socket } from "./socket";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Showproduct from "./component/Showproduct.jsx";
import Messages from './pages/Messages.jsx';
import ProductChat from './component/ProductChat.jsx';

export const API = "https://olx-backend-code.vercel.app";
// export const API = "https://olx-backend-code-w2v6.vercel.app"

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Update socket authentication when token changes
      socket.auth = { token };
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      socket.disconnect();
    }
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={2000} />

      <Headbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path='/abc' element={<ProductChat />}></Route>
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        {/* <Route
            path="/massagees"
            element={
                <Massagees />
            }
          /> */}
        <Route
          path="/showproduct"
          element={
            <PrivateRoute>
              <Showproduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Provider>
  );
}

export default App;
