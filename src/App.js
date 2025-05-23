import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// COMPONENTS
import EditProfile from "./pages/instructor/EditProfile"; // ✅ IMPORTED HERE
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';

// AUTH
import LoginStudent from "./pages/login/LoginStudent";
import LoginAdmin from "./pages/login/LoginAdmin";
import LoginInstructor from "./pages/login/LoginInstructor";
import RegisterInstructor from "./pages/login/RegisterInstructor";

// INSTRUCTOR
import TeacherDashboard from "./pages/instructor/teacher_dashboard";
import Classes_Dashboard from "./pages/instructor/classes_dashboard";
import SectionDashboard from "./pages/instructor/section_dashboard";

// STUDENT
import StudentDashboard from './pages/student/StudentDashboard';

// ADMIN
import AdminDashboard from './pages/admin/AdminDashboard';
import Admin_Students from './pages/admin/students';  // <-- Added import for student page

import ProtectedRoute from "./components/ProtectedRoute";

import DropRequests from './pages/admin/drop_requests';

// Wrapper for routes that use sidebars
function DashboardLayout({ children, selectedDate, setSelectedDate, bgImage, setBgImage }) {

  const location = useLocation();

  // RightSidebar is hidden only on "/drop_requests"
  const showRightSidebar = location.pathname !== "/drop_requests";

  return (
    <div className="flex h-screen w-full">
      <LeftSidebar setBgImage={setBgImage}/>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      {showRightSidebar && (
        <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      )}
    </div>
  );
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bgImage, setBgImage] = useState("url('assets/forest_theme.png')"); 

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Routes (without layout) */}
        <Route path="/" element={<LoginStudent />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-instructor" element={<LoginInstructor />} />
        <Route path="/register-instructor" element={<RegisterInstructor />} />

        {/* Protected Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes-dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <DashboardLayout
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                bgImage={bgImage}
                setBgImage={setBgImage}
              >
                <div
                  className="bg-cover bg-center bg-fixed min-h-screen hide-scrollbar overflow-scroll"
                  style={{ backgroundImage: bgImage }}
                >
                  <Classes_Dashboard selectedDate={selectedDate} />
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <TeacherDashboard selectedDate={selectedDate} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/section-dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <SectionDashboard selectedDate={selectedDate} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected Edit Profile Page for Instructor */}
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <EditProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Students Page for Admin - NEW */}
        <Route
          path="/admin-students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <Admin_Students />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Drop Requests Page for Admin */}
        <Route
          path="/drop_requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
                <DropRequests />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
