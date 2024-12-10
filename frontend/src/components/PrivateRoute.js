// /src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Correct import

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = !!auth.accessToken;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
