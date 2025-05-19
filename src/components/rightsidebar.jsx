import React, { useState } from "react";
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { FiSettings } from "react-icons/fi";

const RightSidebar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2 px-2 md:px-0">
      <h2 className="text-base font-semibold text-gray-700">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="flex gap-4 items-center">
        <button
          className="text-xl text-gray-500 hover:text-[#7685fc]"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <button
          className="text-xl text-gray-500 hover:text-[#7685fc]"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          aria-label="Next month"
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
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSunday = day.getDay() === 0;

        days.push(
          <div
            key={day.toString()}
            className={`font-dm-sans text-sm text-center cursor-pointer rounded-full w-8 h-8 flex items-center justify-center mx-auto transition-all duration-150
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
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedDate(cloneDay);
              }
            }}
            aria-label={`Select date ${format(cloneDay, "MMMM d, yyyy")}`}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow"
        aria-label="Open calendar sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#7685fc]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Overlay for mobile when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`font-dm-sans fixed top-0 right-0 h-full bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300
          w-[70%] sm:w-[60%] md:w-[25%] lg:w-[18%]
          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          }
          md:static md:translate-x-0`}
        aria-label="Calendar Sidebar"
      >
        {/* Header with Settings */}
        <div className="flex items-center justify-between mb-5 px-4 pt-4">
          <div className="flex items-center gap-2">
            <FiSettings className="text-xl text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-xl text-gray-400"
            aria-label="Close calendar sidebar"
          >
            &times;
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 px-4 mb-3">
          <img
            src="assets/Luna_Snow_Uniform_III.png"
            alt="avatar"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <div className="font-semibold text-sm text-gray-800">Austin Dilan Datan</div>
            <div className="text-xs text-gray-500">austindatan@gmail.com</div>
          </div>
        </div>

        {/* Selected Date */}
        <div className="text-xs text-gray-500 px-4 mb-3 select-none">
          {format(selectedDate, "MMMM d, yyyy - EEEE")}
        </div>

        {/* Calendar */}
        <div className="px-4 pb-4 overflow-auto">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;
