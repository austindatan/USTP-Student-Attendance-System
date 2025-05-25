import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaUserGraduate,
  FaUserTie,
  FaClipboardList,
  FaBookOpen,
  FaChevronDown,
} from "react-icons/fa";

const AdminLeftSidebar = () => {
  const navigate = useNavigate();
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const popupRef = useRef(null);
  const gearRef = useRef(null);

  const toggleAcademics = () => {
    setAcademicsOpen(!academicsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login-admin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        gearRef.current &&
        !gearRef.current.contains(event.target)
      ) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full shadow-md p-4 relative">
      <div className="flex items-center mb-6 relative">
        <h2 className="text-xl font-bold text-blue-700 flex-grow">Admin Panel</h2>

        {/* Gear Icon */}
        <button
          ref={gearRef}
          onClick={() => setShowLogout((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-blue-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>

        {/* Logout Popup */}
        {showLogout && (
          <div
            ref={popupRef}
            className="absolute top-12 left-40 ml-1 bg-red-600 rounded shadow-md w-20 text-center z-50"
          >
            <button
              onClick={handleLogout}
              className="w-full py-2 text-white hover:bg-red-800 rounded"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/admin-dashboard")}
        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
      >
        <FaTachometerAlt className="mr-2" />
        Dashboard
      </button>

      <button
        onClick={() => navigate("/drop_requests")}
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
          <FaChevronDown
            className={`ml-auto transform transition-transform duration-200 ${
              academicsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {academicsOpen && (
          <div className="pl-8 mt-2 space-y-2">
            <button
              onClick={() => navigate("/admin-students")}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaUserGraduate className="mr-2" />
              Students Enrolled
            </button>

            <button
              onClick={() => navigate("/admin-instructor")}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaUserTie className="mr-2" />
              Instructors
            </button>

            <button
              onClick={() => navigate("/admin-sections")}
              className="flex items-center w-full text-sm text-gray-600 hover:text-blue-600"
            >
              <FaClipboardList className="mr-2" />
              Sections
            </button>

            <button
              onClick={() => navigate("/admin-courses")}
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
