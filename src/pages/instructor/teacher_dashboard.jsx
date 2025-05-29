import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  FiSettings,
  FiUsers,
  FiCheckCircle,
  FiBookOpen,
  FiCalendar,
  FiMail
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ClassCard from './components/class_card';


export default function Teacher_Dashboard({ selectedDate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [sections, setSections] = useState([]);
  const [messages, setMessages] = useState([]);

  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsPresentToday, setStudentsPresentToday] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const instructor = JSON.parse(localStorage.getItem('instructor'));

  useEffect(() => {
    async function fetchDashboardStats() {
      if (!instructor?.instructor_id || !selectedDate) return;

      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(
          `http://localhost/USTP-Student-Attendance-System/instructor_backend/get_teacher_dashboard_stats.php?instructor_id=${instructor.instructor_id}&date=${dateStr}`
        );
        const data = await response.json();
        setTotalStudents(data.totalStudents);
        setStudentsPresentToday(data.studentsPresentToday);
        setTotalClasses(data.totalClasses);
        setUpcomingEvents(data.upcomingEvents);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    }

    fetchDashboardStats();
  }, [instructor?.instructor_id, selectedDate]);

  useEffect(() => {
    if (!instructor?.instructor_id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_recent_requests.php?instructor_id=${instructor.instructor_id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching recent messages:", err);
      }
    };

    fetchMessages();
  }, [instructor?.instructor_id]);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const instructor = JSON.parse(localStorage.getItem('instructor'));
        if (!instructor) return;

        const dateStr = format(selectedDate || new Date(), 'yyyy-MM-dd');
        const res = await fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_teacher_dashboard_stats.php?instructor_id=${instructor.instructor_id}&date=${dateStr}`);
        const data = await res.json();

        setTotalStudents(data.totalStudents);
        setStudentsPresentToday(data.studentsPresentToday);
        setTotalClasses(data.totalClasses);
        setUpcomingEvents(data.upcomingEvents);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchStats();
  }, [selectedDate]);

  

  const attendanceRate = Math.round((studentsPresentToday / totalStudents) * 100 || 0);

  const emailList = [
    { id: 1, subject: "Reminder: Midterm Grading", sender: "Admin", time: "10 mins ago" },
    { id: 2, subject: "Meeting with Dept. Head", sender: "Principal", time: "1 hour ago" },
    { id: 3, subject: "Student Request", sender: "John Doe", time: "Yesterday" },
  ];


  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      try {
        const res = await fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_weekly_attendance.php?instructor_id=${instructor.instructor_id}`);
        const data = await res.json();
        setAttendanceData(data);
      } catch (err) {
        console.error('Error fetching weekly attendance:', err);
      }
    };

    if (!loading) fetchWeeklyAttendance();
  }, [loading]);

  

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_sections.php?instructor_id=${instructor.instructor_id}`);
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };

    if (!loading) fetchSections();
  }, [loading]);

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12">
        <div
          className="bg-[#7685fc] rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={!loading ? {
            backgroundImage: "url('assets/teacher_vector.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundSize: "contain"
          } : {}}
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
                <h1 className="text-3xl font-bold">{JSON.parse(localStorage.getItem('instructor'))?.firstname || 'Instructor'}</h1>
                <p className="text-sm mt-12">Let’s start teaching!</p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <DashboardCard icon={<FiUsers size={28} />} label="Total Students" count={totalStudents} />
              <DashboardCard icon={<FiCheckCircle size={28} />} label="Present Today" count={studentsPresentToday} />
              <DashboardCard icon={<FiBookOpen size={28} />} label="Total Classes" count={totalClasses} />
              <DashboardCard icon={<FiCalendar size={28} />} label="Upcoming Events" count={upcomingEvents} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-lg col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Attendance This Week</h3>
            {loading ? (
              <div className="animate-pulse h-[250px] bg-gray-200 rounded"></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#7685fc" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg col-span-2 lg:col-span-1 w-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <FiMail /> Recent Messages
            </h3>
            {loading ? (
              <ul className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y divide-gray-200">
                {messages.map(msg => (
                  <li key={msg.id} className="py-2">
                    <p className="font-medium text-gray-800">{msg.subject}</p>
                    <p className="text-sm text-gray-500">{msg.sender} • {msg.time}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {sections.map((section, i) => (
            <ClassCard
              key={i}
              isLoading={false}
              code={`${section.course_code}`}
              title={section.course_name}
              room={section.section_name || 'TBA'}
              schedule={`${section.schedule_day} ${section.start_time} – ${section.end_time}`}
              onClick={() => navigate(`/section-dashboard/${section.section_id}`)}
              bgImage={`${process.env.PUBLIC_URL}/${section?.image}`}
              bgColor={section?.hexcode || "#0097b2"}
            />
          ))}
        </div>

      </section>
    </div>
  );
}

function DashboardCard({ icon, label, count }) {
  return (
    <div className="font-dm-sans bg-white backdrop-blur-md p-5 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-600 line-clamp-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-800 text-wrap break-words max-w-[100px] sm:max-w-[150px] md:max-w-none leading-tight">
          {count}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-100 p-5 rounded-2xl shadow-lg flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-6 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
}
