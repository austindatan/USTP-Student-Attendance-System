import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiCalendar, FiBookOpen } from "react-icons/fi";
import ClassCard from './components/class_card'; // Correct import for ClassCard
import { format } from 'date-fns'; // Used for formatting date for navigation

function DashboardCard({ icon, label, count }) {
  return (
    <div className="font-dm-sans bg-white backdrop-blur-md p-5 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform w-full">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-800">{count ?? 0}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="bg-gray-200 rounded-2xl h-20 animate-pulse w-full"></div>;
}

// Skeleton for the actual ClassCard component
function SkeletonClassCard() {
  return (
    <div className="bg-gray-200 rounded-2xl p-5 shadow-lg flex flex-col gap-3 animate-pulse w-full">
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded mb-1"></div>
      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
    </div>
  );
}

export default function StudentDashboard({ selectedDate }) {
  const navigate = useNavigate();

  const [present, setPresent] = useState(null);
  const [absent, setAbsent] = useState(null);
  const [excused, setExcused] = useState(null);
  const [missed, setMissed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(() => {
    const rawStudentData = localStorage.getItem("student");
    try {
      return rawStudentData ? JSON.parse(rawStudentData) : null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState([]);
  const [classes, setClasses] = useState([]); // State for sections/classes

  // Keep student state in sync with localStorage changes (even from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const rawStudentData = localStorage.getItem("student");
      try {
        setStudent(rawStudentData ? JSON.parse(rawStudentData) : null);
      } catch {
        setStudent(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!student || !student.id) {
      navigate("/login-student");
      return;
    }

    const commonHeaders = { "Content-Type": "application/json" };
    const studentIdBody = { student_id: student.id };

    const attendanceEndpoints = [
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

    const fetchAttendanceData = Promise.all(
      attendanceEndpoints.map(({ url, setter, key }) =>
        fetch(url, {
          method: "POST",
          headers: commonHeaders,
          body: JSON.stringify(studentIdBody),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || `Error fetching ${key}`);
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
    );

    // New API call for classes, using GET and query parameter
    const fetchClassesData = fetch(
      `http://localhost/ustp-student-attendance-system/api/student_backend/get_sections.php?student_id=${student.id}`
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} fetching classes`);
        }
        return res.json();
      })
      .then((data) => {
        setClasses(data); // Assuming data is directly the array of sections
      })
      .catch((err) => {
        console.error('Error fetching classes:', err);
        setClasses([]); // Set to empty array on error
        throw err; // Re-throw to be caught by Promise.all's catch
      });

    Promise.all([fetchAttendanceData, fetchClassesData])
      .then(() => {
        setMessages([
          { id: 1, subject: "Exam Schedule", sender: "Professor Smith", time: "2h ago" },
          { id: 2, subject: "Project Update", sender: "Team Lead", time: "1d ago" },
          { id: 3, subject: "Holiday Announcement", sender: "Admin Office", time: "3d ago" },
        ]);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch dashboard data.");
      })
      .finally(() => setLoading(false));
  }, [student, navigate]); // Depend on student and navigate

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("userRole");
    navigate("/login-student");
  };

  const handleSectionClick = (section) => {
    if (!section?.course_code) return;

    const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    navigate(`/Attendance-Summary/${section.course_code}`, {
      state: { sectionInfo: section, selectedDate: dateParam }
    });
  };

  return (
    <div className="font-dm-sans min-h-screen overflow-y-auto">
      <section className="lg:w-[75%] xl:w-[77%] w-full pt-12 px-6 sm:px-6 md:px-12">
        {/* Header + Attendance Cards */}
        <div className="flex flex-col lg:flex-row gap-6 items-start mb-10 w-full">
          {/* Welcome Card */}
          <div
            className="bg-[#7685fc] rounded-lg px-6 py-8 text-white font-poppins relative overflow-hidden w-full lg:w-3/5"
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
                <div className="animate-pulse space-y-3 ">
                  <div className="w-1/3 h-4 bg-white/50 rounded"></div>
                  <div className="w-1/2 h-8 bg-white/60 rounded"></div>
                  <div className="w-1/4 h-4 mt-10 bg-white/40 rounded"></div>
                </div>
              ) : (
                <>
                  <h2 className="text-base font-semibold">Welcome back,</h2>
                  <h1 className="text-3xl font-bold">
                    {student?.name ? student.name.split(" ")[0] : "Student"}
                  </h1>
                  <p className="text-sm mt-12">Ready to learn today?</p>
                </>
              )}
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-2/5">
            {loading ? (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <p className="text-red-600 font-medium col-span-2 text-center">{error}</p>
            ) : (
              <>
                <DashboardCard icon={<FiCheckCircle size={28} />} label="Present" count={present} />
                <DashboardCard icon={<FiXCircle size={28} />} label="Absent" count={absent} />
                <DashboardCard icon={<FiCalendar size={28} />} label="Excused" count={excused} />
                <DashboardCard icon={<FiBookOpen size={28} />} label="Lates" count={missed} />
              </>
            )}
          </div>
        </div>

        {/* My Classes Section */}
        <div className="mb-10 w-full">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonClassCard key={i} />)
            ) : error ? (
              <p className="text-red-600 font-medium col-span-full text-center">{error}</p>
            ) : classes.length > 0 ? (
              classes.map((section) => (
                <ClassCard
                  key={`${section.section_id}-${section.course_id}`}
                  isLoading={loading}
                  code={section.course_code}
                  title={section.course_name}
                  room={section.section_name || 'TBA'}
                  schedule={`${section.schedule_day} ${section.start_time} – ${section.end_time}`}
                  onClick={() => handleSectionClick(section)}
                  bgImage={section.image ? `${process.env.PUBLIC_URL}/assets/${section.image}` : ''}
                  bgColor={section.hexcode || "#0097b2"} // Default color if hexcode is missing
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No classes found.</p>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}