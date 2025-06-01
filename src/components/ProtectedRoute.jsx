import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, redirectPath = "/LoginStudent" }) => {

  const userRole = localStorage.getItem('userRole');

  if (!userRole) { 
    return <Navigate to={redirectPath} />; 
  }

  if (allowedRoles.includes(userRole)) { 
    return children;
  }

  return <Navigate to={redirectPath} />; 
};

export default ProtectedRoute;