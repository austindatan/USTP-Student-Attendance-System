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
import ClassCard from './components/class_card'; // adjust path if needed

export default function Teacher_Dashboard({ selectedDate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalStudents = 120;
  const studentsPresentToday = 95;
  const totalClasses = 8;
  const upcomingEvents = 3;
  const attendanceRate = Math.round((studentsPresentToday / totalStudents) * 100);

  const emailList = [
    { id: 1, subject: "Reminder: Midterm Grading", sender: "Admin", time: "10 mins ago" },
    { id: 2, subject: "Meeting with Dept. Head", sender: "Principal", time: "1 hour ago" },
    { id: 3, subject: "Student Request", sender: "John Doe", time: "Yesterday" },
  ];

  const attendanceData = [
    { name: 'Mon', students: 92 },
    { name: 'Tue', students: 97 },
    { name: 'Wed', students: 95 },
    { name: 'Thu', students: 89 },
    { name: 'Fri', students: 90 },
  ];

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12">
        
        {/* Header */}
        <div
        className="bg-[#7685fc] rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
        style={
            !loading
            ? {
                backgroundImage: "url('assets/teacher_vector.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right",
                backgroundSize: "contain"
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
                <h1 className="text-3xl font-bold">Austin Dilan</h1>
                <p className="text-sm mt-12">Let’s start teaching!</p>
            </>
            )}
        </div>
        </div>



        {/* Stats Cards */}
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

        {/* Chart + Emails */}
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
                {emailList.map(email => (
                  <li key={email.id} className="py-2">
                    <p className="font-medium text-gray-800">{email.subject}</p>
                    <p className="text-sm text-gray-500">{email.sender} • {email.time}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Classes */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40"></div>
            ))
          ) : (
            <>
              <ClassCard
                isLoading={false}
                code="CS101"
                title="Computer Science Basics"
                room="Lab 1"
                schedule="Mon 9:00AM – 11:00AM"
                onClick={() => console.log("Clicked CS101")}
                bgImage={`${process.env.PUBLIC_URL}/assets/classes_vector_2.png`}
                bgClass="bg-[#0097b2]"
              />
              <ClassCard
                isLoading={false}
                code="ENG201"
                title="English Literature"
                room="Room 305"
                schedule="Tue 1:00PM – 3:00PM"
                onClick={() => console.log("Clicked ENG201")}
                bgImage={`${process.env.PUBLIC_URL}/assets/classes_vector_4.png`}
                bgClass="bg-[#b23a48]"
              />
              <ClassCard
                isLoading={false}
                code="MATH204"
                title="Advanced Calculus"
                room="Room 102"
                schedule="Wed 8:00AM – 10:00AM"
                onClick={() => console.log("Clicked MATH204")}
                bgImage={`${process.env.PUBLIC_URL}/assets/classes_vector_3.png`}
                bgClass="bg-[#1b998b]"
              />
            </>
          )}
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
