import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, redirectPath = "/login-student" }) => {
  // We've added a default redirectPath to /login-student for backward compatibility
  // if you forget to pass it to a student route.

  const userRole = localStorage.getItem('userRole');

  if (!userRole) { // If no user is logged in
    return <Navigate to={redirectPath} />; // Use the dynamic redirectPath
  }

  if (allowedRoles.includes(userRole)) { // If user is logged in and has allowed role
    return children;
  }

  // If user is logged in but has the wrong role (e.g., student tries to access admin)
  return <Navigate to={redirectPath} />; // Use the dynamic redirectPath
};

export default ProtectedRoute;