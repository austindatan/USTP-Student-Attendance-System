import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiCalendar, FiBookOpen } from "react-icons/fi";
import ClassCard from "./Classcard";

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
        url: "http://localhost/USTP-Student-Attendance-System/api/student_backend/get_yearly_present_count.php",
        setter: setPresent,
        key: "total_present",
      },
      {
        url: "http://localhost/USTP-Student-Attendance-System/api/student_backend/get_yearly_absent_count.php",
        setter: setAbsent,
        key: "total_absent",
      },
      {
        url: "http://localhost/USTP-Student-Attendance-System/api/student_backend/get_yearly_excused_count.php",
        setter: setExcused,
        key: "total_excused",
      },
      {
        url: "http://localhost/USTP-Student-Attendance-System/api/student_backend/get_yearly_late_count.php",
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
            code: "IT101",
            title: "Introduction to IT",
            room: "B201",
            schedule: "Mon, Wed 10:00 AM - 12:00 PM",
            teacher: "Mr. Smith",
            present: 20,
            absent: 2,
            late: 1,
            excused: 0,
            bgImage: "/images/computer.png",
            bgColor: "#007acc",
          },
          {
            section_id: 102,
            code: "DS201",
            title: "Data Structures",
            room: "C305",
            schedule: "Tue, Thu 01:00 PM - 03:00 PM",
            teacher: "Ms. Garcia",
            present: 18,
            absent: 4,
            late: 2,
            excused: 1,
            bgImage: "/images/math.png",
            bgColor: "#d97706",
          },
          {
            section_id: 103,
            code: "DM301",
            title: "Discrete Mathematics",
            room: "A102",
            schedule: "Fri 09:00 AM - 11:00 AM",
            teacher: "Mr. Lee",
            present: 22,
            absent: 0,
            late: 0,
            excused: 1,
            bgImage: "/images/book.png",
            bgColor: "#10b981",
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
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen overflow-y-auto">
      <section className="w-full py-8 **px-4** pr-0
                          sm:px-6 md:px-6
                          md:w-full md:mr-auto md:pr-[200px]
                          lg:max-w-screen-xl lg:mr-auto lg:pr-[200px]
                          xl:max-w-[calc(100%-200px)]">
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
                  <h1 className="text-3xl font-bold">{student?.firstname || "Student"}</h1>
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
                <DashboardCard icon={<FiBookOpen size={28} />} label="Missed" count={missed} />
              </>
            )}
          </div>
        </div>

        {/* Upcoming Classes Header */}
        <div className="bg-[#7685fc] p-4 rounded-lg shadow-lg mb-6 w-full">
          <h2 className="text-2xl font-bold text-white font-poppins">Upcoming Classes</h2>
        </div>

        {/* Class Cards */}
        {/* Reverted to w-full. The padding from the parent section will handle the mobile spacing. */}
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <p className="text-red-600 font-medium col-span-full text-center">{error}</p>
          ) : classes.length === 0 ? (
            <p className="text-gray-600 col-span-full text-center">No upcoming classes found.</p>
          ) : (
            classes.map((cls) => (
              <ClassCard
                key={cls.section_id}
                sectionId={cls.section_id}
                code={cls.code}
                title={cls.title}
                room={cls.room}
                schedule={cls.schedule}
                teacher={cls.teacher}
                present={cls.present}
                absent={cls.absent}
                late={cls.late}
                excused={cls.excused}
                bgImage={cls.bgImage}
                bgColor={cls.bgColor}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;