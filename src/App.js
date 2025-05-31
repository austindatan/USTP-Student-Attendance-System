import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"; 

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
import AttendanceSummary from './pages/student/AttendanceSummary'; 

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


const getStudentIdFromLocalStorage = () => {
    const studentDataString = localStorage.getItem('student'); 
    console.log("App.js (getStudentIdFromLocalStorage): Raw student data from localStorage:", studentDataString);
    if (studentDataString) {
        try {
            const studentData = JSON.parse(studentDataString);
            if (studentData && studentData.id) { 
                console.log("App.js (getStudentIdFromLocalStorage): Parsed student ID:", studentData.id);
                return parseInt(studentData.id, 10); 
            }
        } catch (e) {
            console.error("App.js: Error parsing student data from localStorage:", e);
        }
    }
    console.log("App.js (getStudentIdFromLocalStorage): Student data not found or invalid.");
    return null;
};


const ProtectedStudentRoute = ({ studentId, children }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole'); 

    useEffect(() => {
        console.log("ProtectedStudentRoute useEffect: studentId=", studentId, "userRole=", userRole);
        if (!studentId || userRole !== 'student') {
            console.log("ProtectedStudentRoute: Unauthorized access, redirecting to login.");
            navigate('/login-student', { replace: true });
        }
    }, [studentId, userRole, navigate]); 

    if (!studentId || userRole !== 'student') {
        return null; 
    }

    return children;
};


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


function AppContent() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bgImage, setBgImage] = useState(`url('${process.env.PUBLIC_URL}/assets/ustp_theme.png')`);

    const [studentId, setStudentId] = useState(() => getStudentIdFromLocalStorage());
    console.log("App.js (AppContent render): current studentId state =", studentId);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("App.js (AppContent useEffect): Location path changed or AppContent mounted/updated. Re-checking studentId...");

        const currentStudentId = getStudentIdFromLocalStorage();
        if (studentId !== currentStudentId) { 
            setStudentId(currentStudentId);
            console.log("App.js (AppContent useEffect): studentId state updated to:", currentStudentId);
        }

        const handleStorageChange = (event) => {
            if (event.key === 'student') {
                console.log("App.js (storage event): 'student' item changed in localStorage (from another tab).");
                const updatedStudentId = getStudentIdFromLocalStorage();
                if (studentId !== updatedStudentId) {
                    setStudentId(updatedStudentId);
                    console.log("App.js (storage event): studentId state updated to:", updatedStudentId);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [location.pathname, studentId]); 


    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('student'); 
        setStudentId(null); 
        navigate("/login-student", { replace: true });
        console.log("User logged out. studentId state set to null.");
    };

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginStudent />} />
            <Route path="/login-student" element={<LoginStudent />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/login-instructor" element={<LoginInstructor />} />
            <Route path="/register-instructor" element={<RegisterInstructor />} />

            {/* Student Protected Routes */}
            <Route
                path="/student-dashboard"
                element={
                    <ProtectedStudentRoute studentId={studentId}>
                        <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                            <StudentDashboard studentId={studentId} onLogout={handleLogout} />
                        </StudentLayout>
                    </ProtectedStudentRoute>
                }
            />
            
            <Route path="/Attendance-Summary/:course_code" element={
                <ProtectedStudentRoute studentId={studentId}>
                    <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                        {studentId ? (
                            <AttendanceSummary studentId={studentId} />
                        ) : (
                            <div>Loading student attendance data...</div>
                        )}
                    </StudentLayout>
                </ProtectedStudentRoute>
            } />

            <Route
                path="/student-classes-dashboard"
                element={
                    <ProtectedStudentRoute studentId={studentId}>
                        <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                            <StudentClassesDashboard />
                        </StudentLayout>
                    </ProtectedStudentRoute>
                }
            />

            <Route
                path="/student-edit-profile"
                element={
                    <ProtectedStudentRoute studentId={studentId}>
                        <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                            <StudentEditProfile />
                        </StudentLayout>
                    </ProtectedStudentRoute>
                }
            />

            <Route
                path="/add-excuse-request"
                element={
                    <ProtectedStudentRoute studentId={studentId}>
                        <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                            {studentId ? (
                                <AddExcuseRequest studentId={studentId} />
                            ) : (
                                <div>Loading student data for excuse request...</div>
                            )}
                        </StudentLayout>
                    </ProtectedStudentRoute>
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

            {/* Admin Protected Routes */}
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
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;