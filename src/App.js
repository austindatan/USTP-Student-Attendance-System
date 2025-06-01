import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"; 

import EditProfile from "./pages/instructor/EditProfile";
import LeftSidebar from './components/LeftSidebar';
import AdminLeftSidebar from './components/AdminLeftSidebar';
import RightSidebar from './components/RightSidebar';
import StudentLeftSideBar from './components/StudentLeftSideBar';

import LoginStudent from "./pages/login/LoginStudent";
import LoginAdmin from "./pages/login/LoginAdmin";
import LoginInstructor from "./pages/login/LoginInstructor";
import RegisterInstructor from "./pages/login/RegisterInstructor";

import TeacherDashboard from "./pages/instructor/TeacherDashboard";
import ClassesDashboard from "./pages/instructor/ClassesDashboard";
import SectionDashboard from "./pages/instructor/SectionDashboard";
import ExcuseRequestsPage from "./pages/instructor/ExcuseRequests";

import StudentDashboard from './pages/student/StudentDashboard';
import StudentRightSidebar from './components/StudentRightSidebar';
import StudentEditProfile from './pages/student/StudentEditProfile';
import StudentClassesDashboard from './pages/student/StudentClassesDashboard';
import AddExcuseRequest from './pages/student/AddExcuseRequest';
import AttendanceSummary from './pages/student/AttendanceSummary'; 
import ExcuseRequestTable from "./pages/student/RequestsView";

import AdminDashboard from './pages/admin/AdminDashboard';
import Admin_Students from './pages/admin/Students';
import DropRequests from './pages/admin/DropRequests';
import InstructorAdminPage from './pages/admin/InstructorAdminPage';
import AddStudent from './pages/admin/AddStudent';
import EditStudent from './pages/admin/EditStudent';
import Sections from './pages/admin/Sections';
import Courses from './pages/admin/Courses';
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
            navigate('/LoginStudent', { replace: true });
        }
    }, [studentId, userRole, navigate]); 

    if (!studentId || userRole !== 'student') {
        return null; 
    }

    return children;
};


function DashboardLayout({ children, selectedDate, setSelectedDate, bgImage, setBgImage }) {
    const location = useLocation();
    const isStudentDashboard = location.pathname === "/student-Dashboard"; 
    const showRightSidebar = location.pathname !== "/DropRequests";

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
        navigate("/LoginStudent", { replace: true });
        console.log("User logged out. studentId state set to null.");
    };

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginStudent />} />
            <Route path="/LoginStudent" element={<LoginStudent />} />
            <Route path="/LoginAdmin" element={<LoginAdmin />} />
            <Route path="/LoginInstructor" element={<LoginInstructor />} />
            <Route path="/LoginInstructor" element={<RegisterInstructor />} />

            {/* Student Protected Routes */}
            <Route
                path="/student-Dashboard"
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
                path="/student-classes-Dashboard"
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

            <Route
                path="/view-excuse-request"
                element={
                    <ProtectedStudentRoute studentId={studentId}>
                        <StudentLayout bgImage={bgImage} setBgImage={setBgImage}>
                            {studentId ? (
                                <ExcuseRequestTable studentId={studentId} />
                            ) : (
                                <div>Loading student data for excuse request...</div>
                            )}
                        </StudentLayout>
                    </ProtectedStudentRoute>
                }
            />


            {/* Instructor Protected Routes */}
            <Route
                path="/teacher-Dashboard"
                element={
                    <ProtectedRoute allowedRoles={['instructor']} redirectPath="/LoginInstructor">
                        <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                            <TeacherDashboard selectedDate={selectedDate} />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/section-Dashboard/:sectionId"
                element={
                    <ProtectedRoute allowedRoles={['instructor']} redirectPath="/LoginInstructor">
                        <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                            <SectionDashboard selectedDate={selectedDate} />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/classes-Dashboard"
                element={
                    <ProtectedRoute allowedRoles={['instructor']} redirectPath="/LoginInstructor">
                        <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                            <ClassesDashboard selectedDate={selectedDate} />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit-profile"
                element={
                    <ProtectedRoute allowedRoles={['instructor']} redirectPath="/LoginInstructor">
                        <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                            <EditProfile />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/excuse-requests"
                element={
                    <ProtectedRoute allowedRoles={['instructor']} redirectPath="/LoginInstructor">
                        <DashboardLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate} bgImage={bgImage} setBgImage={setBgImage}>
                            <ExcuseRequestsPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Admin Protected Routes */}
            <Route
                path="/admin-Dashboard"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Students"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <Admin_Students />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/DropRequests"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <DropRequests />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-instructor"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <InstructorAdminPage />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Sections"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <Sections />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Sections/add"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <AddSection />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-edit-section/:id" 
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <EditSection />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Courses"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <Courses />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Courses/add"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <AddCourse />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Courses/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <EditCourse />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Students/add"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <AddStudent />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-Students/edit/:student_id"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <EditStudent />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-instructor/add"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <AddInstructor />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-instructor/edit/:instructor_id"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <EditInstructor />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/Sections/:sectionId/Courses"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <SectionCourses />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/Sections/:sectionId/Courses/:sectionCourseId/edit"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
                        <AdminLayout>
                            <EditSectionCourse />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/Sections/:sectionId/Courses/add"
                element={
                    <ProtectedRoute allowedRoles={['admin']} redirectPath="/LoginAdmin">
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