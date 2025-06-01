import React, { useState, useEffect, useCallback } from "react";
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
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SubjectAttendanceSummary({ studentId }) {
  const navigate = useNavigate();
  const { course_code } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [courseInfo, setCourseInfo] = useState(null);

  // State for counts
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalExcused, setTotalExcused] = useState(0);

  // State for attendance dates (YYYY-MM-DD format)
  const [presentDates, setPresentDates] = useState(new Set()); // Using Set for efficient lookups
  const [absentDates, setAbsentDates] = useState(new Set());
  const [lateDates, setLateDates] = useState(new Set());
  const [excusedDates, setExcusedDates] = useState(new Set());

  // Helper function to fetch attendance data
  const fetchAttendanceData = useCallback(async (status) => {
    const url = `http://localhost/ustp-student-attendance-system/api/student_backend/get_class_${status}.php?student_id=${studentId}&course_code=${course_code}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.error) {
        console.error(`API returned an error for ${status} count/dates:`, data.error);
        return { total: 0, dates: [] };
      } else {
        const totalKey = `total_${status}`;
        const datesKey = `${status}_dates`;
        return {
          total: data[totalKey] !== undefined ? data[totalKey] : 0,
          dates: Array.isArray(data[datesKey]) ? data[datesKey] : [],
        };
      }
    } catch (err) {
      console.error(`Error fetching ${status} data from API:`, err);
      return { total: 0, dates: [] };
    }
  }, [studentId, course_code]);


  useEffect(() => {
    if (studentId && course_code) {
      // --- Fetch Course Name, Image, and Hexcode ---
      const fetchCourseInfoUrl = `http://localhost/ustp-student-attendance-system/api/student_backend/get_coursename.php?student_id=${studentId}&course_code=${course_code}`;

      fetch(fetchCourseInfoUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.error) {
            setCourseInfo({ course_name: "Error loading course" });
          } else if (data && data.course_name) {
            setCourseInfo(data); // data now includes image and hexcode
          } else {
            setCourseInfo({ course_name: "Course Not Found" });
          }
        })
        .catch((err) => {
          console.error("Error fetching course info from API:", err);
          setCourseInfo({ course_name: "Failed to Load Course" });
        });

      // --- Fetch all attendance data concurrently ---
      const statuses = ["present", "absent", "late", "excused"];
      Promise.all(statuses.map(status => fetchAttendanceData(status)))
        .then(([presentData, absentData, lateData, excusedData]) => {
          setTotalPresent(presentData.total);
          setPresentDates(new Set(presentData.dates));

          setTotalAbsent(absentData.total);
          setAbsentDates(new Set(absentData.dates));

          setTotalLate(lateData.total);
          setLateDates(new Set(lateData.dates));

          setTotalExcused(excusedData.total);
          setExcusedDates(new Set(excusedData.dates));
        });

    } else {
      setCourseInfo(null);
      setTotalPresent(0);
      setTotalAbsent(0);
      setTotalLate(0);
      setTotalExcused(0);
      setPresentDates(new Set());
      setAbsentDates(new Set());
      setLateDates(new Set());
      setExcusedDates(new Set());
    }
  }, [studentId, course_code, fetchAttendanceData]);

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2 h-14 px-2 sm:px-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="flex gap-4 items-center">
        <button
          aria-label="Previous Month"
          className="text-2xl text-gray-500 hover:text-[#7685fc] focus:outline-none focus:ring-2 focus:ring-[#7685fc] rounded"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          &lt;
        </button>
        <button
          aria-label="Next Month"
          className="text-2xl text-gray-500 hover:text-[#7685fc] focus:outline-none focus:ring-2 focus:ring-[#7685fc] rounded"
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
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="text-[11px] sm:text-xs font-medium text-center text-gray-400 uppercase select-none"
          key={i}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-1 px-2 sm:px-4">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = addDays(startDate, 41);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDay = format(cloneDay, "yyyy-MM-dd"); // Format date for lookup
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSunday = day.getDay() === 0;

        // Determine attendance status for coloring
        let attendanceClass = "";
        let attendanceTitle = "";

        if (absentDates.has(formattedDay)) {
          attendanceClass = "bg-red-500 text-white"; // Red for Absent
          attendanceTitle = "Absent";
        } else if (lateDates.has(formattedDay)) {
          attendanceClass = "bg-yellow-500 text-white"; // Yellow/Orange for Late
          attendanceTitle = "Late";
        } else if (excusedDates.has(formattedDay)) {
          attendanceClass = "bg-purple-500 text-white"; // Purple for Excused
          attendanceTitle = "Excused";
        } else if (presentDates.has(formattedDay)) {
          attendanceClass = "bg-green-500 text-white"; // Green for Present
          attendanceTitle = "Present";
        }

        // Combine base styles with attendance status styles
        const cellClasses = `text-sm text-center cursor-pointer rounded-full w-8 h-8 flex items-center justify-center mx-auto transition-all duration-150 relative
          ${
            isSelected
              ? "ring-2 ring-offset-2 ring-[#7685fc]" // Add a ring for selected date
              : ""
          }
          ${
            isToday && !attendanceClass // Only show default today border if no attendance status overrides it
              ? "border border-[#7685fc] text-[#7685fc]"
              : ""
          }
          ${
            isCurrentMonth && !attendanceClass // Only apply default text color if no attendance status
              ? isSunday
                ? "text-red-500"
                : "text-gray-700"
              : ""
          }
          ${
            !isCurrentMonth && !attendanceClass
              ? "text-gray-300"
              : ""
          }
          ${attendanceClass}
        `;

        days.push(
          <button
            key={`${formattedDay}-cell`}
            className={cellClasses}
            onClick={() => setSelectedDate(cloneDay)}
            aria-pressed={isSelected}
            aria-label={`Select ${format(cloneDay, "MMMM do, yyyy")}${attendanceTitle ? `, Status: ${attendanceTitle}` : ""}`}
            title={attendanceTitle ? `Status: ${attendanceTitle}` : ""}
          >
            {format(day, "d")}
          </button>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 mb-1 px-2 sm:px-4" key={format(day, "yyyy-MM-dd-'row")}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="font-dm-sans min-h-screen overflow-y-auto">
      <section className="lg:w-[75%] xl:w-[76%] w-full pt-12 px-6 sm:px-6 md:px-12">
        {/* Header Section */}
        <div
          className="rounded-lg p-6 md:p-10 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundColor: courseInfo?.hexcode || '#7685fc', // Apply hexcode for background
            backgroundImage: courseInfo?.image ? `url(${process.env.PUBLIC_URL}/assets/${courseInfo.image})` : "url('assets/teacher_vector.png')", // Apply image
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 20px center",
            backgroundSize: "contain",
          }}
        >
          <div className="leading-snug max-w-xl">
            <button onClick={() => navigate("/student-dashboard")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-medium">Attendance Summary for</h2>
            <h1 className="text-xl sm:text-3xl font-bold truncate">
              {courseInfo?.course_name || "Loading..."}
            </h1>
            <p className="text-sm sm:text-base mt-4 sm:mt-6">
              Keep track of attendance and stay informed.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
   <div className="p-4 sm:p-6 rounded-lg max-w-full lg:max-w-5xl flex flex-col md:flex-row gap-3 mb-6"
          style={{
            backgroundColor: courseInfo?.hexcode || '#7685fc',
          }}
        >
          {/* Calendar */}
          <div className="ml-0 sm:ml-4 bg-[#f5f5f0] rounded-lg p-4 md:p-6 text-gray-700 w-full md:w-[380px] flex-shrink-0 overflow-auto">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            {/* Attendance Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold mb-2">Legend:</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500"></span>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500"></span>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                  <span>Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-500"></span> {/* Changed to purple */}
                  <span>Excused</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="flex flex-col justify-center items-start w-full min-h-[220px] md:min-h-[300px] gap-6 px-2 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <StatCard label="Total No. of Present" value={totalPresent} />
              <StatCard label="Total No. of Absent" value={totalAbsent} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <StatCard label="Total No. of Late" value={totalLate} />
              <StatCard label="Total No. of Excused" value={totalExcused} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#f5f5f0] p-5 rounded-lg text-gray-700
                         flex flex-col items-center justify-center
                         shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Label on top, typically smaller */}
      <p className="text-base sm:text-lg font-semibold text-center w-full truncate mb-1">
        {label}
      </p>
      {/* Value below, much larger and bold */}
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center w-full">
        {value}
      </p>
    </div>
  );
}