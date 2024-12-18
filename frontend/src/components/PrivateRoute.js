// /src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = !!auth.accessToken;
  const userRole = auth.user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
