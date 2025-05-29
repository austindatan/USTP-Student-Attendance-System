import React, { useEffect, useRef, useState } from "react";
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const instructor = JSON.parse(localStorage.getItem("instructor"));

  const fullName = instructor
    ? `${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`
    : "";
  const email = instructor?.email || "";

  const imagePath = instructor?.image
    ? `http://localhost/ustp-student-attendance/api/uploads/${instructor.image.replace(
        "uploads/",
        ""
      )}`
    : "/assets/blank.jpeg";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("instructor");
    navigate("/login-instructor");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); 
    return () => clearTimeout(timer);
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
    const endDate = addDays(startDate, 41);

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
              ${
                isSelected
                  ? "bg-[#7685fc] text-white"
                  : isToday
                  ? "border border-[#7685fc] text-[#7685fc]"
                  : isCurrentMonth
                  ? isSunday
                    ? "text-red-500"
                    : "text-gray-700"
                  : "text-gray-300"
              }`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 mb-1" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <>
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

      <aside
        className={`font-dm-sans fixed top-0 right-0 h-full w-[85%] sm:w-[60%] lg:w-[23%] bg-white shadow-lg flex flex-col p-4 border-l border-gray-200 z-40 transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} 
          lg:translate-x-0 lg:relative lg:flex`}
      >
        <div className="lg:hidden flex justify-start mb-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-blue-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-between mb-5 relative">
          <div className="relative" ref={dropdownRef}>
            {isLoading ? (
              <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <FiSettings
                className="text-xl text-gray-500 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            )}

            {dropdownOpen && (
  <div className="absolute left-full ml-2 top-0 w-40 bg-white rounded shadow-md border z-50">
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
            {isLoading ? (
              <>
                <div className="space-y-1">
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-right">
                  <div className="font-semibold text-sm text-gray-800">
                    {fullName}
                  </div>
                  <div className="text-xs text-gray-500">{email}</div>
                </div>
                <img
                  src={imagePath}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border object-cover"
                />
              </>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          {isLoading ? (
            <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
          ) : selectedDate ? (
            format(selectedDate, "MMMM d, yyyy - EEEE")
          ) : (
            "No date selected"
          )}
        </div>

        <div className="bg-white">
          {isLoading ? (
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="grid grid-cols-7 gap-1 mb-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div className="grid grid-cols-7 gap-1 mb-1" key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, cellIndex) => (
                    <div
                      key={cellIndex}
                      className="w-8 h-8 rounded-full bg-gray-200 mx-auto animate-pulse"
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;
