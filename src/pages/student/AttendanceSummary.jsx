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
  const [totalLate, setTotalLate] = useState(0);     // New state for Late count
  const [totalExcused, setTotalExcused] = useState(0); // New state for Excused count


  useEffect(() => {
    if (studentId && course_code) {
      // --- Fetch Course Name ---
      const fetchCourseNameUrl = `http://localhost/USTP-Student-Attendance-System/api/student_backend/get_coursename.php?student_id=${studentId}&course_code=${course_code}`;

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
      const fetchPresentUrl = `http://localhost/USTP-Student-Attendance-System/api/student_backend/get_class_present.php?student_id=${studentId}&course_code=${course_code}`;

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
      const fetchAbsentUrl = `http://localhost/USTP-Student-Attendance-System/api/student_backend/get_class_absent.php?student_id=${studentId}&course_code=${course_code}`;

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
      const fetchLateUrl = `http://localhost/USTP-Student-Attendance-System/api/student_backend/get_class_late.php?student_id=${studentId}&course_code=${course_code}`;

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
      const fetchExcusedUrl = `http://localhost/USTP-Student-Attendance-System/api/student_backend/get_class_excused.php?student_id=${studentId}&course_code=${course_code}`;

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
      // Reset all states if studentId or course_code is not available
      setCourseInfo(null);
      setTotalPresent(0);
      setTotalAbsent(0);
      setTotalLate(0);
      setTotalExcused(0);
    }
  }, [studentId, course_code]); // Dependency array ensures effect runs when studentId or course_code changes

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2 h-14">
      <h2 className="text-xl font-semibold text-gray-700">
        {format(currentMonth, "MMMM")}
      </h2>
      <div className="gap-4 flex items-center">
        <button
          className="text-2xl text-gray-500 hover:text-[#7685fc]"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          &lt;
        </button>
        <button
          className="text-2xl text-gray-500 hover:text-[#7685fc]"
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
        <div className="text-[12px] font-medium text-center text-gray-400" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-1">{days}</div>;
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
          <div
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
            onClick={() => {
              setSelectedDate(cloneDay);
            }}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 mb-1"
             key={format(day, "yyyy-MM-dd-'row'")}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="mt-10">
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
          <h2 className="text-xl font-medium">Attendance Summary for</h2>
          <h1 className="text-3xl font-bold">{courseInfo?.course_name || "Loading..."}</h1>
          <p className="text-base mt-6">Keep track of attendance and stay informed.</p>
        </div>
      </div>

      <div className="bg-[#7685fc] p-6 rounded-lg max-w-4xl ml-12 md:ml-20 flex gap-8">
        <div className="bg-[#f5f5f0] rounded-lg p-4 md:p-6 text-gray-700 ml-7 md:ml-2 w-[400px]">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>

        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col max-w-xl w-full gap-4">
            <div className="flex gap-4">
              {/* Display Total Present */}
              <div className="bg-[#f5f5f0] p-6 rounded-lg flex-1 text-gray-700 flex items-center justify-start">
                <p><strong>Total No. of Present:</strong> {totalPresent}</p>
              </div>
              {/* Display Total Absent */}
              <div className="bg-[#f5f5f0] p-6 rounded-lg flex-1 text-gray-700 flex items-center justify-end">
                <p><strong>Total No. of Absent:</strong> {totalAbsent}</p>
              </div>
            </div>
            <div className="flex gap-4"> {/* New row for Late and Excused */}
              {/* Display Total Late */}
              <div className="bg-[#f5f5f0] p-6 rounded-lg flex-1 text-gray-700 flex items-center justify-start">
                <p><strong>Total No. of Late:</strong> {totalLate}</p>
              </div>
              {/* Display Total Excused */}
              <div className="bg-[#f5f5f0] p-6 rounded-lg flex-1 text-gray-700 flex items-center justify-end">
                <p><strong>Total No. of Excused:</strong> {totalExcused}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}