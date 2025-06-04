import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }

    return children;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
