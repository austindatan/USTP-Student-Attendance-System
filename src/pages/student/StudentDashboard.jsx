import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiCalendar, FiBookOpen } from "react-icons/fi";


// Helper components
function DashboardCard({ icon, label, count }) {
  return (
    <div className="font-dm-sans bg-white backdrop-blur-md p-5 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform min-w-[130px]">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-800">{count ?? 0}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="bg-gray-200 rounded-2xl h-20 animate-pulse"></div>;
}

function StudentDashboard() {
  const navigate = useNavigate();

  const [present, setPresent] = useState(null);
  const [absent, setAbsent] = useState(null);
  const [excused, setExcused] = useState(null);
  const [missed, setMissed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  const [messages, setMessages] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const rawStudentData = localStorage.getItem("student");

    if (!rawStudentData) {
      navigate("/login-student");
      return;
    }

    let parsedStudent;
    try {
      parsedStudent = JSON.parse(rawStudentData);
      if (!parsedStudent || !parsedStudent.id) {
        navigate("/login-student");
        return;
      }
      setStudent(parsedStudent);
    } catch (e) {
      navigate("/login-student");
      return;
    }

    const endpoints = [
      {
        url: "http://localhost/ustp-student-attendance-system/api/student_backend/get_yearly_present_count.php",
        setter: setPresent,
        key: "total_present",
      },
      {
        url: "http://localhost/ustp-student-attendance-system/api/student_backend/get_yearly_absent_count.php",
        setter: setAbsent,
        key: "total_absent",
      },
      {
        url: "http://localhost/ustp-student-attendance-system/api/student_backend/get_yearly_excused_count.php",
        setter: setExcused,
        key: "total_excused",
      },
      {
        url: "http://localhost/ustp-student-attendance-system/api/student_backend/get_yearly_late_count.php",
        setter: setMissed,
        key: "total_late",
      },
    ];

    Promise.all(
      endpoints.map(({ url, setter, key }) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: parsedStudent.id }),
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
      .then(() => {
        setMessages([
          { id: 1, subject: "Exam Schedule", sender: "Professor Smith", time: "2h ago" },
          { id: 2, subject: "Project Update", sender: "Team Lead", time: "1d ago" },
          { id: 3, subject: "Holiday Announcement", sender: "Admin Office", time: "3d ago" },
        ]);

        setClasses([
          {
            section_id: 101,
            subject: "Introduction to IT",
            teacher: "Mr. Smith",
            present: 20,
            absent: 2,
            late: 1,
            excused: 0,
          },
          {
            section_id: 102,
            subject: "Data Structures",
            teacher: "Ms. Garcia",
            present: 18,
            absent: 4,
            late: 2,
            excused: 1,
          },
          {
            section_id: 103,
            subject: "Discrete Mathematics",
            teacher: "Mr. Lee",
            present: 22,
            absent: 0,
            late: 0,
            excused: 1,
          },
        ]);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch attendance.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("userRole");
    navigate("/login-student");
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12">
        {/* Header + Attendance Cards in Flex Row */}
        <div className="flex flex-col lg:flex-row gap-6 items-start mb-8">
          {/* Welcome Header */}
          <div
            className="bg-[#7685fc] rounded-lg p-6 text-white font-poppins relative overflow-hidden w-full lg:w-1/2 aspect-square lg:aspect-auto"
            style={
              !loading
                ? {
                    backgroundImage: "url('assets/student_vector.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right",
                    backgroundSize: "contain",
                  }
                : {}
            }
          >
            <div className="leading-none">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="w-1/3 h-4 bg-white/50 rounded"></div>
                  <div className="w-1/2 h-8 bg-white/60 rounded"></div>
                  <div className="w-1/4 h-4 mt-10 bg-white/40 rounded"></div>
                </div>
              ) : (
                <>
                  <h2 className="text-base font-semibold">Welcome back,</h2>
                  <h1 className="text-3xl font-bold">{student?.firstname || "Student"}</h1>
                  <p className="text-sm mt-12">Ready to learn today?</p>
                </>
              )}
            </div>
          </div>

          {/* Attendance Cards beside welcome */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full lg:w-1/2">
            {loading ? (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <p className="text-red-600 font-medium col-span-4 text-center">{error}</p>
            ) : (
              <>
                <DashboardCard icon={<FiCheckCircle size={28} />} label="Present" count={present} />
                <DashboardCard icon={<FiXCircle size={28} />} label="Absent" count={absent} />
                <DashboardCard icon={<FiCalendar size={28} />} label="Excused" count={excused} />
                <DashboardCard icon={<FiBookOpen size={28} />} label="Missed" count={missed} />
              </>
            )}
          </div>
        </div>

        {/* Attendance Summary Table */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-10 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Attendance Summary by Subject</h2>
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Present</th>
                <th className="px-4 py-2 border">Absent</th>
                <th className="px-4 py-2 border">Late</th>
                <th className="px-4 py-2 border">Excused</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.section_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{cls.subject}</td>
                  <td className="px-4 py-2 border">{cls.teacher}</td>
                  <td className="px-4 py-2 border">{cls.present}</td>
                  <td className="px-4 py-2 border">{cls.absent}</td>
                  <td className="px-4 py-2 border">{cls.late}</td>
                  <td className="px-4 py-2 border">{cls.excused}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-10 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </section>
    </div>
  );
}

export default StudentDashboard;