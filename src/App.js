import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeacherDashboard from "./pages/instructor/teacher_dashboard";
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';
import LoginStudent from "./pages/login/LoginStudent";
import LoginAdmin from "./pages/login/LoginAdmin";
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import LoginInstructor from "./pages/login/LoginInstructor";
import RegisterInstructor from "./pages/login/RegisterInstructor";

// Layout wrapper for sidebar pages only
function DashboardLayout({ children, selectedDate, setSelectedDate }) {
  return (
    <div className="flex h-screen w-full">
      <LeftSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </div>
  );
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Pages (NO sidebar) */}
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

        {/* Protected Teacher Dashboard */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
