import React from "react";
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user session
    localStorage.removeItem('student');
    // Redirect the user to the login page
    navigate('/login-student');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to the Student Dashboard</h1>
      <p className="mt-4 text-gray-700">You have successfully logged in as a student.</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;