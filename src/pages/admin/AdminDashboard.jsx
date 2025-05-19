import React from "react";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clears the user session
    localStorage.removeItem('admin');
    // Redirect the user to the login page
    navigate('/login-admin');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to the Admin Dashboard</h1>
      <p className="mt-4 text-gray-700">You have successfully logged in as admin.</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;