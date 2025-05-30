import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Component Imports (Ensure these paths are correct for your project)
import EditProfile from "./pages/instructor/EditProfile";
import LeftSidebar from './components/leftsidebar';
import AdminLeftSidebar from './components/AdminLeftSidebar';
import RightSidebar from './components/rightsidebar';
import StudentLeftSideBar from './components/StudentLeftSideBar';

import LoginStudent from "./pages/login/LoginStudent";
import LoginAdmin from "./pages/login/LoginAdmin";
import LoginInstructor from "./pages/login/LoginInstructor";
import RegisterInstructor from "./pages/login/RegisterInstructor";

import TeacherDashboard from "./pages/instructor/teacher_dashboard";
import Classes_Dashboard from "./pages/instructor/classes_dashboard";
import SectionDashboard from "./pages/instructor/section_dashboard";
import ExcuseRequestsPage from "./pages/instructor/excuse_requests";

import StudentDashboard from './pages/student/StudentDashboard';
import StudentRightSidebar from './components/student_rightsidebar';
import StudentEditProfile from './pages/student/StudentEditProfile';
import StudentClassesDashboard from './pages/student/StudentClassesDashboard';
import AddExcuseRequest from './pages/student/AddExcuseRequest';
import AttendanceSummary from './pages/student/AttendanceSummary'; // Import your AttendanceSummary component

import AdminDashboard from './pages/admin/AdminDashboard';
import Admin_Students from './pages/admin/students';
import DropRequests from './pages/admin/drop_requests';
import InstructorAdminPage from './pages/admin/instructorAdminpage';
import AddStudent from './pages/admin/AddStudent';
import EditStudent from './pages/admin/EditStudent';
import Sections from './pages/admin/sections';
import Courses from './pages/admin/courses';
import AddInstructor from './pages/admin/AddInstructor';
import EditInstructor from './pages/admin/EditInstructor';
import AddCourse from './pages/admin/AddCourse';
import AddSection from './pages/admin/AddSection';
import EditSection from './pages/admin/EditSection';
import EditCourse from './pages/admin/EditCourse';
import SectionCourses from './pages/admin/SectionCourses';
import EditSectionCourse from './pages/admin/EditSectionCourse';
import AddSectionCourse from './pages/admin/AddSectionCourse';

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";


function DashboardLayout({ children, selectedDate, setSelectedDate, bgImage, setBgImage }) {
  const location = useLocation();
  const isStudentDashboard = location.pathname === "/student-dashboard";
  const showRightSidebar = location.pathname !== "/drop_requests";

  return (
    <div className="flex h-screen w-full">
      {!isStudentDashboard && <LeftSidebar setBgImage={setBgImage} />}
      <div className="flex-1 overflow-y-auto bg-cover bg-center bg-fixed hide-scrollbar" style={{ backgroundImage: bgImage }}>
        {children}
      </div>
      {!isStudentDashboard && showRightSidebar && (
        <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      )}
    </div>
  );
}

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

function StudentLayout({ children, bgImage, setBgImage }) {
  return (
    <div className="flex h-screen w-full">
      <StudentLeftSideBar setBgImage={setBgImage} />
      <div className="flex-1 overflow-y-auto bg-cover bg-center bg-fixed" style={{ backgroundImage: bgImage }}>
        {children}
      </div>
      <StudentRightSidebar />
    </div>
  );
}


function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bgImage, setBgImage] = useState(`url('${process.env.PUBLIC_URL}/assets/ustp_theme.png')`);

  const [studentId, setStudentId] = useState(null);
  console.log("App.js (render): current studentId state =", studentId); 
    
  useEffect(() => {
    const idFromLocalStorage = localStorage.getItem('studentId');
    console.log("App.js (useEffect): Loaded studentId from localStorage:", idFromLocalStorage, " (type: " + typeof idFromLocalStorage + ")");

    if (idFromLocalStorage && idFromLocalStorage !== "null" && idFromLocalStorage !== "undefined" && idFromLocalStorage !== "") {
      const parsedId = parseInt(idFromLocalStorage, 10);
      if (!isNaN(parsedId)) { 
          setStudentId(parsedId); 
          console.log("App.js (useEffect): Set studentId to (parsed):", parsedId, " (type: " + typeof parsedId + ")");
      } else {
          setStudentId(null);
          console.log("App.js (useEffect): Parsed ID was NaN, setting to null.");
      }
    } else {
      setStudentId(null);
      console.log("App.js (useEffect): localStorage ID was falsy, setting to null.");
    }

    const handleStorageChange = (event) => {
      if (event.key === 'studentId') {
        const updatedId = event.newValue;
        console.log("App.js (storage event): studentId updated:", updatedId);
        if (updatedId && updatedId !== "null" && updatedId !== "undefined" && updatedId !== "") {
          setStudentId(parseInt(updatedId, 10)); // Ensure parsed as number
        } else {
          setStudentId(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginStudent />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-instructor" element={<LoginInstructor />} />
        <Route path="/register-instructor" element={<RegisterInstructor />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']} redirectPath="/login-student">
              <StudentLayout
                bgImage={bgImage}
                setBgImage={setBgImage}
              >
                <StudentDashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />
        {/* Route for Attendance Summary with conditional rendering */}
        <Route path="/Attendance-Summary/:course_code" element={
            <ProtectedRoute allowedRoles={['student']} redirectPath="/login-student">
                <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                    {/* Render AttendanceSummary ONLY if studentId is available */}
                    {studentId ? (
                        <AttendanceSummary studentId={studentId} />
                    ) : (
                        // Show a loading message while studentId is null/undefined
                        <div>Loading student attendance data...</div>
                    )}
                </StudentLayout>
            </ProtectedRoute>
        } />

        <Route
          path="/student-classes-dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']} redirectPath="/login-student">
              <StudentLayout
                bgImage={bgImage}
                setBgImage={setBgImage}
              >
                <StudentClassesDashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-edit-profile"
          element={
            <ProtectedRoute allowedRoles={['student']} redirectPath="/login-student">
              <StudentLayout
                bgImage={bgImage}
                setBgImage={setBgImage}
              >
                <StudentEditProfile />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-excuse-request"
          element={
            <ProtectedRoute allowedRoles={['student']} redirectPath="/login-student">
              <StudentLayout
                bgImage={bgImage}
                setBgImage={setBgImage}
              >
                <AddExcuseRequest studentId={studentId} />
              </StudentLayout>
            </ProtectedRoute>
          }
        />


        {/* Instructor Protected Routes */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']} redirectPath="/login-instructor">
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                <TeacherDashboard selectedDate={selectedDate} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/section-dashboard/:sectionId"
          element={
            <ProtectedRoute allowedRoles={['instructor']} redirectPath="/login-instructor">
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                <SectionDashboard selectedDate={selectedDate} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes-dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']} redirectPath="/login-instructor">
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                <Classes_Dashboard selectedDate={selectedDate} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute allowedRoles={['instructor']} redirectPath="/login-instructor">
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                <EditProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/excuse-requests"
          element={
            <ProtectedRoute allowedRoles={['instructor']} redirectPath="/login-instructor">
              <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                <ExcuseRequestsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-students"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <Admin_Students />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/drop_requests"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <DropRequests />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-instructor"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <InstructorAdminPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-sections"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <Sections />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-sections/add"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <AddSection />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-edit-section/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <EditSection />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-courses"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <Courses />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-courses/add"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <AddCourse />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-courses/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <EditCourse />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-students/add"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <AddStudent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-students/edit/:student_id"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <EditStudent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-instructor/add"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <AddInstructor />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-instructor/edit/:instructor_id"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
              <AdminLayout>
                <EditInstructor />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
            path="/sections/:sectionId/courses"
            element={
                <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
                    <AdminLayout>
                        <SectionCourses />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />

        <Route
            path="/sections/:sectionId/courses/:sectionCourseId/edit"
            element={
                <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
                    <AdminLayout>
                        <EditSectionCourse />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />

        <Route
            path="/sections/:sectionId/courses/add"
            element={
                <ProtectedRoute allowedRoles={['admin']} redirectPath="/login-admin">
                    <AdminLayout>
                        <AddSectionCourse />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />



        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;