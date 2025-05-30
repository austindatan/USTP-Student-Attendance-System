import React, { useState, useEffect } from "react";
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

export default function SubjectAttendanceSummary({ subjectName = "Subject", attendanceTotals = {} }) {
  const { present = 0, absent = 0, excused = 0 } = attendanceTotals;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2 h-14">
      <h2 className="text-xl font-semibold text-gray-700"> {/* Changed from text-base to text-xl */}
        {format(currentMonth, "MMMM yyyy")} {/* Changed "MMMM\u00A0yyyy" to "MMMM yyyy" for clarity */}
      </h2>
      <div className="gap-4 flex items-center">
        <button
          className="text-2xl text-gray-500 hover:text-[#7685fc]" // Changed from text-xl to text-2xl
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          &lt;
        </button>
        <button
          className="text-2xl text-gray-500 hover:text-[#7685fc]" // Changed from text-xl to text-2xl
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
            onClick={() => {
              setSelectedDate(cloneDay);
              setCurrentMonth(cloneDay);
            }}
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
    <div className="mt-10">
      {/* Top container imitation from Teacher_Dashboard */}
      <div
        className="bg-[#7685fc] rounded-lg p-8 md:p-10 text-white font-poppins mt-6 mb-6 relative overflow-hidden max-w-4xl ml-8 md:ml-20"
        style={{
          backgroundImage: "url('assets/teacher_vector.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
          backgroundSize: "contain",
        }}
      >
        <div className="leading-snug">
          <h2 className="text-xl font-medium">Attendance Summary for</h2> {/* Changed from text-sm to text-xl */}
          <h1 className="text-3xl font-bold">{subjectName}</h1> {/* Changed from text-xl to text-3xl */}
          <p className="text-base mt-6">Keep track of attendance and stay informed.</p> {/* Changed from text-xs to text-base */}
        </div>
      </div>

      <div className="bg-[#7685fc] p-6 rounded-lg max-w-4xl ml-12 md:ml-20 flex gap-8">
        {/* Calendar */}
        <div className="bg-[#f5f5f0] rounded-lg p-4 md:p-6 text-gray-700 ml-7 md:ml-2 w-[400px]">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>

        {/* Parent container with flex to center content vertically and horizontally */}
        <div className="flex justify-center items-center min-h-[300px]">
          {/* Attendance Totals with new layout */}
          <div className="flex flex-col max-w-xl w-full gap-4">
            <div className="flex gap-4">
              <div className="bg-[#f5f5f0] p-6 rounded-lg flex-1 text-gray-700 flex items-center justify-start">
                <p><strong>Total No. of Present:</strong> {present}</p>
              </div>
              <div className="bg-[#f5f5f0] p-6 rounded-lg flex-1 text-gray-700 flex items-center justify-end">
                <p><strong>Total No. of Absent:</strong> {absent}</p>
              </div>
            </div>
            <div className="bg-[#f5f5f0] p-6 rounded-lg text-gray-700 flex items-center justify-center">
              <p><strong>Total No. of Excused:</strong> {excused}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}