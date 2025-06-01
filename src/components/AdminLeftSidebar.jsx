import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaUserGraduate,
  FaUserTie,
  FaClipboardList,
  FaBookOpen,
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
  const [paletteOpen, setPaletteOpen] = useState(false); 


  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleAcademics = () => setAcademicsOpen((prev) => !prev);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
    setPaletteOpen(false);
    setAcademicsOpen(false);
  };


  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/LoginAdmin");
  };


  useEffect(() => {
    applyBackground("/assets/ustp_theme.png");
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
      {!isOpen && (
        <button
          className="fixed top-4 left-4 md:hidden p-2 rounded bg-white shadow z-[9999]"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <HamburgerIcon />
        </button>
      )}

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-50 p-4 bg-white border-r border-gray-200 shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex justify-center items-center p-4">
          <img
            src="/assets/ustp_logo.png"
            alt="USTP Logo"
            className="w-10 h-auto"
          />
        </div>
        <nav>

          <button
            onClick={() => handleNavigate("/admin-Dashboard")}
            className={`mt-3 group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
              window.location.pathname === "/admin-Dashboard"
                ? "text-[#7685fc]"
                : "hover:text-[#7685fc] text-[#737373]"
            }`}
          >
            <FaTachometerAlt className="w-7 h-7 mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate("/DropRequests")}
            className={`mt-3 group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
              window.location.pathname === "/DropRequests"
                ? "text-[#7685fc]"
                : "hover:text-[#7685fc] text-[#737373]"
            }`}
          >
            <FaClipboardList className="w-7 h-7 mb-1" />
            <span className="text-xs text-center">
              Drop <br /> Requests
            </span>
          </button>

          <div className="mt-3">
            <button
              onClick={toggleAcademics}
              className={`group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center relative ${
                academicsOpen
                  ? "text-[#7685fc]"
                  : "hover:text-[#7685fc] text-[#737373]"
              }`}
            >
              <FaBook className="w-7 h-7 mb-1" />
              <div className="flex items-center justify-center gap-1">
                <span className="text-xs">Academics</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-2 h-2 transition-transform ${
                    academicsOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25L12 15.75 4.5 8.25"
                  />
                </svg>
              </div>
            </button>

            {academicsOpen && (
              <div className="mt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNavigate("/admin-Students")}
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
                  onClick={() => handleNavigate("/admin-Sections")}
                  className="group flex flex-col items-center text-[10px] text-[#737373] hover:text-[#7685fc]"
                >
                  <FaClipboardList className="w-5 h-5 mb-2" />
                  Sections
                </button>
                <button
                  onClick={() => handleNavigate("/admin-Courses")}
                  className="group flex flex-col items-center text-[10px] text-[#737373] hover:text-[#7685fc]"
                >
                  <FaBookOpen className="w-5 h-5 mb-2" />
                  Courses
                </button>
              </div>
            )}
          </div>

  
<div className="relative mt-3">
  <button
    onClick={() => setPaletteOpen((prev) => !prev)}
    className="group flex flex-col items-center px-4 py-2 rounded-lg focus:outline-none"
  >
    <div className="relative w-7 h-7 mb-1">
      <img
        src="/assets/palette.png"
        alt="Palette Default"
        className={`absolute inset-0 w-7 h-7 transition-opacity ${
          paletteOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src="/assets/palette-active.png"
        alt="Palette Active"
        className={`absolute inset-0 w-7 h-7 transition-opacity ${
          paletteOpen ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
    <span
      className={`text-xs transition-colors ${
        paletteOpen ? "text-[#7685fc]" : "text-[#737373]"
      }`}
    >
      Wallpapers
    </span>
  </button>

            {paletteOpen && (
              <div
                className={`absolute left-1 font-dm-sans text-sm bg-white border rounded-md shadow-md z-50 ${
                  academicsOpen ? "bottom-12" : "top-full"
                }`}
              >
                {[
                  { label: "Water", img: "/assets/water_theme1.png" },
                  { label: "Forest", img: "/assets/forest_theme.png" },
                  { label: "USTP", img: "/assets/ustp_theme.png" },
                  { label: "Default", img: "/assets/white_theme.png" },
                ].map(({ label, img }) => (
                  <button
                    key={label}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      applyBackground(img);
                      setPaletteOpen(false);
                      setIsOpen(false); 
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>


          <div className="absolute bottom-4 w-full flex justify-center right-0">
            <div className="mt-3 w-full">
              <button
                onClick={handleLogout}
                className="group flex flex-col items-center px-3 py-2 rounded-lg w-full text-center text-red-600 hover:text-white hover:bg-red-600 transition-all"
              >
                <FaSignOutAlt className="w-7 h-7 mb-1" />
                <span className="text-xs">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminLeftSidebar;
