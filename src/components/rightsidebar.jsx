import React, { useEffect, useRef } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({ selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const instructor = JSON.parse(localStorage.getItem("instructor"));

  const fullName = instructor
    ? `${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`
    : "Instructor Name";
  const email = instructor?.email || "instructor@email.com";

  const imagePath = instructor?.image
    ? `http://localhost/USTP-Student-Attendance-System/api/uploads/${instructor.image.replace('uploads/', '')}`
    : "/assets/blank.jpeg";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("instructor");
    navigate("/login-instructor");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-base font-semibold text-gray-700">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="gap-4 flex items-center">
        <button
          className="text-xl text-gray-500 hover:text-[#7685fc]"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          &lt;
        </button>
        <button
          className="text-xl text-gray-500 hover:text-[#7685fc]"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          &gt;
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = "EE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="text-[12px] font-medium text-center text-gray-400"
          key={i}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = addDays(startDate, 41); // 6 weeks

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSunday = day.getDay() === 0;

        days.push(
          <div
            key={day}
            className={`text-sm text-center cursor-pointer rounded-full w-8 h-8 flex items-center justify-center mx-auto transition-all duration-150
              ${isSelected ? "bg-[#7685fc] text-white"
                : isToday ? "border border-[#7685fc] text-[#7685fc]"
                  : isCurrentMonth ? (isSunday ? "text-red-500" : "text-gray-700")
                    : "text-gray-300"}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 mb-1" key={day}>{days}</div>);
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <>
      {/* Hamburger button */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            onClick={toggleSidebar}
            className="bg-white w-12 h-10 shadow-md border rounded-md hover:shadow-lg transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`font-dm-sans fixed top-0 right-0 h-full w-[85%] sm:w-[60%] lg:w-[23%] bg-white shadow-lg flex flex-col p-4 border-l border-gray-200 z-40 transition-transform duration-300 
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} 
        lg:translate-x-0 lg:relative lg:flex`}>

        {/* X button for mobile */}
        <div className="lg:hidden flex justify-start mb-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-blue-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Top Info with Dropdown */}
        <div className="flex items-center justify-between mb-5 relative">
          <div className="relative" ref={dropdownRef}>
            <FiSettings
              className="text-xl text-gray-500 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md border z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/edit-profile");
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

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-semibold text-sm text-gray-800">{fullName}</div>
              <div className="text-xs text-gray-500">{email}</div>
            </div>
            <img
              src={imagePath}
              alt="avatar"
              className="w-10 h-10 rounded-full border object-cover"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          {selectedDate ? format(selectedDate, "MMMM d, yyyy - EEEE") : "No date selected"}
        </div>

        <div className="bg-white">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;
