import React, { useEffect, useRef, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StudentRightSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));
  const fullName = student
    ? student.name || student.student_name || [student.firstname, student.middlename, student.lastname].filter(Boolean).join(" ")
    : "Tony Stark";
  const email = student?.email || "tonytark@gmail.com";
  const imagePath = student?.image
    ? `http://localhost/USTP-Student-Attendance-System/api/uploads/${student.image.replace(
        "uploads/",
        ""
      )}`
    : "/assets/cloud-avatar.png";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/login-student");
  };

  return (
    <aside className="font-dm-sans fixed top-0 right-0 h-full w-[85%] sm:w-[60%] lg:w-[23%] bg-white shadow-lg flex flex-col z-40 border-l border-gray-200">
      <div className="flex justify-start items-center p-4">
        <div className="relative" ref={dropdownRef}>
          <FiSettings
            className="text-xl text-gray-700 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute left-full ml-2 top-0 w-40 bg-white rounded shadow-md border z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/student-edit-profile");
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        {isLoading ? (
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4" />
        ) : (
          <img
            src={imagePath}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}
        <div className="font-bold text-lg text-center">{fullName}</div>
        <div className="text-gray-500 text-center text-sm mt-1">{email}</div>
      </div>
    </aside>
  );
};

export default StudentRightSidebar;