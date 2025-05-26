import React, { useState, useEffect } from "react";
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
  FaSignOutAlt,
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

  useEffect(() => {
    applyBackground("assets/ustp_theme.png");
  }, []);

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
        className="fixed top-4 left-4 z-160 md:hidden p-2 rounded bg-white shadow"
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
        className={`fixed top-0 left-0 h-full w-50 p-4 bg-white border-r border-gray-200 shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex justify-center items-center p-4 relative">
          <img
            src={`${process.env.PUBLIC_URL}/assets/ustp_logo.png`}
            alt="USTP Logo"
            className="w-10 h-auto"
          />
        </div>

        {/* Navigation */}
        <nav>
          <button
            onClick={() => handleNavigate("/admin-dashboard")}
            className={`mt-3 group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
              window.location.pathname === "/admin-dashboard"
                ? "text-[#7685fc]"
                : "hover:text-[#7685fc] text-[#737373]"
            }`}
          >
            <FaTachometerAlt className="w-7 h-7 mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate("/drop_requests")}
            className={`mt-3 group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
              window.location.pathname === "/drop_requests"
                ? "text-[#7685fc]"
                : "hover:text-[#7685fc] text-[#737373]"
            }`}
          >
            <FaClipboardList className="w-7 h-7 mb-1" />
            <span className="text-xs">
              Drop <br />
              Requests
            </span>
          </button>

          <div className="mt-3">
            <button
              onClick={toggleAcademics}
              className={`group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
                academicsOpen
                  ? "text-[#7685fc]"
                  : "hover:text-[#7685fc] text-[#737373]"
              }`}
            >
              <FaBook className="w-7 h-7 mb-1" />
              <span className="text-xs flex items-center gap-1">
                Academics
              </span>
            </button>

            {academicsOpen && (
              <div className="mt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNavigate("/admin-students")}
                  className="group flex flex-col items-center text-[10px] text-[#737373] hover:text-[#7685fc]"
                >
                  <FaUserGraduate className="w-5 h-5 mb-2" />
                  Students
                </button>

                <button
                  onClick={() => handleNavigate("/admin-instructor")}
                  className="group flex flex-col items-center text-[10px] text-[#737373] hover:text-[#7685fc]"
                >
                  <FaUserTie className="w-5 h-5 mb-2" />
                  Instructors
                </button>
                <button
                  onClick={() => handleNavigate("/admin-sections")}
                  className="group flex flex-col items-center text-[10px] text-[#737373] hover:text-[#7685fc]"
                >
                  <FaClipboardList className="w-5 h-5 mb-2" />
                  Sections
                </button>
                <button
                  onClick={() => handleNavigate("/admin-courses")}
                  className="group flex flex-col items-center text-[10px] text-[#737373] hover:text-[#7685fc]"
                >
                  <FaBookOpen className="w-5 h-5 mb-2" />
                  Courses
                </button>
              </div>
            )}
          </div>

          <div className="relative group mt-3">
            <button className="group flex flex-col items-center px-3 py-2 rounded-lg text-[#737373] hover:text-[#7685fc]">
              <div className="relative w-7 h-7 mb-1">
                <img
                  src="assets/palette.png"
                  alt="Theme Icon"
                  className="absolute inset-0 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <img
                  src="assets/palette-active.png"
                  alt="Theme Active Icon"
                  className="absolute inset-0 w-7 h-7 opacity-100 group-hover:opacity-0 transition-opacity"
                />
              </div>
              <span className="text-xs">Wallpapers</span>
            </button>

            <div className="absolute top-full left-1 font-dm-sans text-sm bg-white border rounded-md shadow-md hidden group-hover:block z-50">
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

          <div className="absolute bottom-4 w-full flex justify-center right-[0]">
            <div className="mt-3">
              <button
                onClick={handleLogout}
                className="group flex flex-col items-center px-3 py-2 rounded-lg w-full text-center text-red-600 hover:text-white hover:bg-red-600 transition-all"
              >
                <FaSignOutAlt className="w-6 h-6 mb-1" />
                <span className="text-xs">Log Out</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminLeftSidebar;
