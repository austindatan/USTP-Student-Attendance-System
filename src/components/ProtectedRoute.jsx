import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    return <Navigate to="/login-student" />;
  }

  if (allowedRoles.includes(userRole)) {
    return children;
  }

  return <Navigate to="/login-student" />;
};

export default ProtectedRoute;
