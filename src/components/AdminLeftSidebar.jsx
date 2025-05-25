import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaUserGraduate,
  FaUserTie,
  FaClipboardList,
  FaBookOpen,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const AdminLeftSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleAcademics = () => setAcademicsOpen(!academicsOpen);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login-admin");
  };

  const applyBackground = (url) => {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
  };

  return (
    <>
      {/* Hamburger for Mobile */}
      <button
        className="fixed top-4 left-4 z-60 md:hidden p-2 rounded bg-white shadow"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <HamburgerIcon />}
      </button>

      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 p-4 bg-white border-r border-gray-200 shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex-shrink-0`}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold text-blue-700 flex-grow">
            Admin Panel
          </h2>
        </div>

        {/* Navigation */}
        <nav>
          <button
            onClick={() => handleNavigate("/admin-dashboard")}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <FaTachometerAlt className="mr-2" /> Dashboard
          </button>

          <button
            onClick={() => handleNavigate("/drop_requests")}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded mt-2"
          >
            <FaClipboardList className="mr-2" /> Drop Requests
          </button>

          {/* Academics Dropdown */}
          <div className="mt-4">
            <button
              onClick={toggleAcademics}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <FaBook className="mr-2" /> Academics
              <FaChevronDown
                className={`ml-auto transform transition-transform ${
                  academicsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {academicsOpen && (
              <div className="pl-8 mt-2 space-y-2 text-sm text-gray-600">
                <button
                  onClick={() => handleNavigate("/admin-students")}
                  className="flex items-center w-full hover:text-blue-600"
                >
                  <FaUserGraduate className="mr-2" /> Students Enrolled
                </button>
                <button
                  onClick={() => handleNavigate("/admin-instructor")}
                  className="flex items-center w-full hover:text-blue-600"
                >
                  <FaUserTie className="mr-2" /> Instructors
                </button>
                <button
                  onClick={() => handleNavigate("/admin-sections")}
                  className="flex items-center w-full hover:text-blue-600"
                >
                  <FaClipboardList className="mr-2" /> Sections
                </button>
                <button
                  onClick={() => handleNavigate("/admin-courses")}
                  className="flex items-center w-full hover:text-blue-600"
                >
                  <FaBookOpen className="mr-2" /> Courses
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Theme Selector */}
        <div className="absolute bottom-4 w-full flex justify-center">
          <div className="relative group">
            <button className="group flex flex-col items-center px-3 py-2 rounded-lg text-[#737373] hover:text-[#7685fc]">
              <div className="relative w-8 h-8 mb-1">
                <img
                  src="assets/palette.png"
                  alt="Theme Icon"
                  className="absolute inset-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <img
                  src="assets/palette-active.png"
                  alt="Theme Active Icon"
                  className="absolute inset-0 w-8 h-8 opacity-100 group-hover:opacity-0 transition-opacity"
                />
              </div>
              <span className="text-xs">Wallpapers</span>
            </button>

            <div className="absolute bottom-full left-1 font-dm-sans text-sm bg-white border rounded-md shadow-md hidden group-hover:block z-50">
              {[
                { label: "Water", img: "assets/water_theme1.png" },
                { label: "Forest", img: "assets/forest_theme.png" },
                { label: "USTP", img: "assets/ustp_theme.png" },
                { label: "Default", img: "assets/white_theme.png" },
              ].map(({ label, img }) => (
                <button
                  key={label}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  onClick={() => applyBackground(img)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLeftSidebar;
