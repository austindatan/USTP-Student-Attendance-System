import React, { useState, useEffect } from "react";
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

export default function SubjectAttendanceSummary({ studentId }) {
  const { course_code } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [courseInfo, setCourseInfo] = useState(null);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalExcused, setTotalExcused] = useState(0);

  useEffect(() => {
    if (studentId && course_code) {
      // --- Fetch Course Name ---
      const fetchCourseNameUrl = `http://localhost/ustp-student-attendance/api/student_backend/get_coursename.php?student_id=${studentId}&course_code=${course_code}`;

      fetch(fetchCourseNameUrl)
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
            setCourseInfo(data);
          } else {
            setCourseInfo({ course_name: "Course Not Found" });
          }
        })
        .catch((err) => {
          console.error("Error fetching course name info from API:", err);
          setCourseInfo({ course_name: "Failed to Load Course" });
        });

      // --- Fetch Total Present Count ---
      const fetchPresentUrl = `http://localhost/ustp-student-attendance/api/student_backend/get_class_present.php?student_id=${studentId}&course_code=${course_code}`;

      fetch(fetchPresentUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.error) {
            console.error("API returned an error for present count:", data.error);
            setTotalPresent(0);
          } else if (data && typeof data.total_present !== 'undefined') {
            setTotalPresent(data.total_present);
          } else {
            console.warn("API response for present count missing 'total_present' or unexpected format:", data);
            setTotalPresent(0);
          }
        })
        .catch((err) => {
          console.error("Error fetching present count from API:", err);
          setTotalPresent(0);
        });

      // --- Fetch Total Absent Count ---
      const fetchAbsentUrl = `http://localhost/ustp-student-attendance/api/student_backend/get_class_absent.php?student_id=${studentId}&course_code=${course_code}`;

      fetch(fetchAbsentUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.error) {
            console.error("API returned an error for absent count:", data.error);
            setTotalAbsent(0);
          } else if (data && typeof data.total_absent !== 'undefined') {
            setTotalAbsent(data.total_absent);
          } else {
            console.warn("API response for absent count missing 'total_absent' or unexpected format:", data);
            setTotalAbsent(0);
          }
        })
        .catch((err) => {
          console.error("Error fetching absent count from API:", err);
          setTotalAbsent(0);
        });

      // --- NEW: Fetch Total Late Count ---
      const fetchLateUrl = `http://localhost/ustp-student-attendance/api/student_backend/get_class_late.php?student_id=${studentId}&course_code=${course_code}`;

      fetch(fetchLateUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.error) {
            console.error("API returned an error for late count:", data.error);
            setTotalLate(0);
          } else if (data && typeof data.total_late !== 'undefined') {
            setTotalLate(data.total_late);
          } else {
            console.warn("API response for late count missing 'total_late' or unexpected format:", data);
            setTotalLate(0);
          }
        })
        .catch((err) => {
          console.error("Error fetching late count from API:", err);
          setTotalLate(0);
        });

      // --- NEW: Fetch Total Excused Count ---
      const fetchExcusedUrl = `http://localhost/ustp-student-attendance/api/student_backend/get_class_excused.php?student_id=${studentId}&course_code=${course_code}`;

      fetch(fetchExcusedUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.error) {
            console.error("API returned an error for excused count:", data.error);
            setTotalExcused(0);
          } else if (data && typeof data.total_excused !== 'undefined') {
            setTotalExcused(data.total_excused);
          } else {
            console.warn("API response for excused count missing 'total_excused' or unexpected format:", data);
            setTotalExcused(0);
          }
        })
        .catch((err) => {
          console.error("Error fetching excused count from API:", err);
          setTotalExcused(0);
        });

    } else {
      setCourseInfo(null);
      setTotalPresent(0);
      setTotalAbsent(0);
      setTotalLate(0);
      setTotalExcused(0);
    }
  }, [studentId, course_code]);

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
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSunday = day.getDay() === 0;

        days.push(
          <button
            key={`${format(cloneDay, "yyyy-MM-dd")}-cell`}
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
            aria-pressed={isSelected}
            aria-label={`Select ${format(cloneDay, "MMMM do, yyyy")}`}
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
    <div className="mt-10 p-4 sm:p-6 md:p-8 max-w-full lg:max-w-5xl">
      {/* Header Section */}
      <div
        className="bg-[#7685fc] rounded-lg p-6 md:p-10 text-white font-poppins mb-6 relative overflow-hidden"
        style={{
          backgroundImage: "url('assets/teacher_vector.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "contain",
        }}
      >
        <div className="leading-snug max-w-xl">
          <h2 className="text-lg sm:text-xl font-medium">Attendance Summary for</h2>
          <h1 className="text-2xl sm:text-3xl font-bold truncate">
            {courseInfo?.course_name || "Loading..."}
          </h1>
          <p className="text-sm sm:text-base mt-4 sm:mt-6">
            Keep track of attendance and stay informed.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-[#7685fc] p-4 sm:p-6 rounded-lg max-w-full lg:max-w-5xl flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <div className="bg-[#f5f5f0] rounded-lg p-4 md:p-6 text-gray-700 w-full md:w-[320px] flex-shrink-0 overflow-auto">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
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
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#f5f5f0] p-5 rounded-lg text-gray-700 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
      <p className="text-base sm:text-lg font-semibold text-center w-full truncate">
        {label}: <span className="font-bold">{value}</span>
      </p>
    </div>
  );
}
