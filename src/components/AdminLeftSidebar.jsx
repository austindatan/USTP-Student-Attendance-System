import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBook, FaUserGraduate, FaUserTie, FaClipboardList, FaBookOpen, FaChevronDown } from "react-icons/fa";

const AdminLeftSidebar = () => {
  const navigate = useNavigate();
  const [academicsOpen, setAcademicsOpen] = useState(false);

  const toggleAcademics = () => {
    setAcademicsOpen(!academicsOpen);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full shadow-md p-4">
      <h2 className="text-xl font-bold text-blue-700 mb-6">Admin Panel</h2>

      <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
      >
        <FaTachometerAlt className="mr-2" />
        Dashboard
      </button>

      <button
        onClick={() => navigate('/drop_requests')}
        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded mt-2"
      >
        <FaClipboardList className="mr-2" />
        Drop Requests
      </button>

      {/* Academics Dropdown */}
      <div className="mt-4">
        <button
          onClick={toggleAcademics}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <FaBook className="mr-2" />
          Academics
          <FaChevronDown className={`ml-auto transform transition-transform duration-200 ${academicsOpen ? "rotate-180" : ""}`} />
        </button>

        {academicsOpen && (
          <div className="pl-8 mt-2 space-y-2">
            <button
              onClick={() => navigate('/admin-students')}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaUserGraduate className="mr-2" />
              Students Enrolled
            </button>

            <button
              onClick={() => navigate('/admin-instructor')}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaUserTie className="mr-2" />
              Instructors
            </button>

            <button
              onClick={() => navigate('/admin-sections')}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaClipboardList className="mr-2" />
              Sections
            </button>

            <button
              onClick={() => navigate('/admin-courses')}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaBookOpen className="mr-2" />
              Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeftSidebar;