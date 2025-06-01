import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const studentName = JSON.parse(localStorage.getItem("student"))?.name || "Student Name";

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/LoginStudent");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-wrap justify-between items-center px-4 sm:px-6 py-3 bg-blue-950 border-b shadow-md">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <img
          src="/assets/ustp_logo.png"
          alt="USTP Logo"
          className="h-10 w-10 object-contain bg-white p-1 rounded"
        />
        <span className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight">
          University of Science and Technology of Southern Philippines
        </span>
      </div>

      <div
        className="relative w-full sm:w-auto mt-3 sm:mt-0 text-right cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="text-sm sm:text-base text-white font-medium flex items-center justify-end gap-1 truncate max-w-full sm:max-w-none">
          <svg
            className={`w-4 h-4 text-white transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
          <span className="truncate max-w-[120px] sm:max-w-none">{studentName}</span>
        </span>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/student-profile");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;
