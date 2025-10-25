import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  return user && user.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
