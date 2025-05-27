import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [presentCount, setPresentCount] = useState(null);
  const [absentCount, setAbsentCount] = useState(null);
  const [excusedCount, setExcusedCount] = useState(null);
  const [lateCount, setLateCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("userRole");
    navigate("/login-student");
  };

  useEffect(() => {
    const rawStudentData = localStorage.getItem("student");

    if (!rawStudentData) {
      console.warn("No student data found.");
      navigate("/login-student");
      return;
    }

    let student;
    try {
      student = JSON.parse(rawStudentData);
      if (!student || !student.id) {
        navigate("/login-student");
        return;
      }
    } catch (e) {
      console.error("Failed to parse student data:", e);
      navigate("/login-student");
      return;
    }

    const endpoints = [
      {
        url: "http://localhost/ustp-student-attendance/api/student_backend/get_yearly_present_count.php",
        setter: setPresentCount,
        key: "total_present",
      },
      {
        url: "http://localhost/ustp-student-attendance/api/student_backend/get_yearly_absent_count.php",
        setter: setAbsentCount,
        key: "total_absent",
      },
      {
        url: "http://localhost/ustp-student-attendance/api/student_backend/get_yearly_excused_count.php",
        setter: setExcusedCount,
        key: "total_excused",
      },
      {
        url: "http://localhost/ustp-student-attendance/api/student_backend/get_yearly_late_count.php",
        setter: setLateCount,
        key: "total_late",
      },
    ];

    Promise.all(
      endpoints.map(({ url, setter, key }) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: student.id }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || "Unknown error");
            }
            return res.json();
          })
          .then((data) => {
            if (data[key] !== undefined) {
              setter(data[key]);
            } else {
              throw new Error(`Invalid response format for ${key}`);
            }
          })
      )
    )
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch attendance.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 min-h-screen bg-gray-100 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Your Present Attendance Count ({currentYear})
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 font-medium">Error: {error}</p>
        ) : (
          <p className="text-lg font-medium text-green-700">
            Total Present: {presentCount}
          </p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Your Absent Attendance Count ({currentYear})
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 font-medium">Error: {error}</p>
        ) : (
          <p className="text-lg font-medium text-red-700">
            Total Absent: {absentCount}
          </p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Your Excused Attendance Count ({currentYear})
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 font-medium">Error: {error}</p>
        ) : (
          <p className="text-lg font-medium text-yellow-600">
            Total Excused: {excusedCount}
          </p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Your Late Attendance Count ({currentYear})
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 font-medium">Error: {error}</p>
        ) : (
          <p className="text-lg font-medium text-orange-600">
            Total Late: {lateCount}
          </p>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;