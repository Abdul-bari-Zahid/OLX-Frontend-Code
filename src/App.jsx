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
import Message from "./pages/Massage.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import PrivateRoute from "./component/PrivateRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Showproduct } from "./component/Showproduct.jsx";

// API base URL
export const API = "http://localhost:3002";

function App() {
  return (
    <Provider store={store}>
      {/* <BrowserRouter> */}
        <ToastContainer position="top-right" autoClose={2000} />
        
        {/* Header */}
        <Headbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/shop" element={<Shop />} />

          {/* Protected Routes */}
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
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
                <Message />
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

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer */}
        <Footer />
      {/* </BrowserRouter> */}
    </Provider>
  );
}

export default App;
