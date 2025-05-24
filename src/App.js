import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// COMPONENTS
import EditProfile from "./pages/instructor/EditProfile";
import LeftSidebar from './components/leftsidebar';
import AdminLeftSidebar from './components/AdminLeftSidebar';
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
import Admin_Students from './pages/admin/students';
import DropRequests from './pages/admin/drop_requests';
import InstructorAdminPage from './pages/admin/instructorAdminpage';

// ROUTE GUARD
import ProtectedRoute from "./components/ProtectedRoute";

// Wrapper for Instructor & Student routes
function DashboardLayout({ children, selectedDate, setSelectedDate, bgImage, setBgImage }) {
  const location = useLocation();
  const showRightSidebar = location.pathname !== "/drop_requests";

  return (
    <div className="flex h-screen w-full">
      <LeftSidebar setBgImage={setBgImage} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      {showRightSidebar && (
        <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      )}
    </div>
  );
}

// Wrapper for Admin routes
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen w-full">
      <AdminLeftSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bgImage, setBgImage] = useState("url('assets/forest_theme.png')"); 

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Routes */}
        <Route path="/" element={<LoginStudent />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-instructor" element={<LoginInstructor />} />
        <Route path="/register-instructor" element={<RegisterInstructor />} />

        {/* Student Protected Route */}
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

        {/* Instructor Protected Routes */}
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
                <TeacherDashboard selectedDate={selectedDate} />
                </div> 
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/section-dashboard"
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
                <SectionDashboard selectedDate={selectedDate} />
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
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
                <EditProfile />
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Admin_Students />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/drop_requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <DropRequests />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin-instructor"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <InstructorAdminPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />



      </Routes>

    </BrowserRouter>
  );
}

export default App;
