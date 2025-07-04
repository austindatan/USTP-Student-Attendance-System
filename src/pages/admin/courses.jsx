import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../../components/MessageModal';

export default function Admin_Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();

    // Message Modal states
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalTitle, setMessageModalTitle] = useState('');
    const [messageModalMessage, setMessageModalMessage] = useState('');
    const [messageModalType, setMessageModalType] = useState('info');

    const [floatingMessage, setFloatingMessage] = useState("");
    const [isFloatingMessageError, setIsFloatingMessageError] = useState(false);

    const showMessageModal = useCallback((title, message, type = 'info') => {
        setMessageModalTitle(title);
        setMessageModalMessage(message);
        setMessageModalType(type);
        setIsMessageModalOpen(true);
    }, []);

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessageModalTitle('');
        setMessageModalMessage('');
        setMessageModalType('info');
    };

    const showFloatingMessage = useCallback((msg, isError) => {
        setFloatingMessage(msg);
        setIsFloatingMessageError(isError);
        const timer = setTimeout(() => {
            setFloatingMessage("");
            setIsFloatingMessageError(false);
        }, 3000); 
        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        axios.get('http://localhost/ustp-student-attendance/api/admin-backend/get_course.php')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setCourses(res.data);
                    if (res.data.length > 0) {
                        showFloatingMessage("Courses loaded successfully!", false);
                    } else {
                        showFloatingMessage("No courses found.", false);
                    }
                } else if (Array.isArray(res.data.courses)) {
                    setCourses(res.data.courses);
                     if (res.data.courses.length > 0) {
                        showFloatingMessage("Courses loaded successfully!", false);
                    } else {
                        showFloatingMessage("No courses found.", false);
                    }
                } else {
                    console.error("Unexpected data format from get_course.php:", res.data);
                    setCourses([]);
                    showFloatingMessage('Received unexpected data format for courses. Cannot display courses.', true);
                }
            })
            .catch((err) => {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses. Please check the server.");
                showFloatingMessage('Failed to fetch courses from the server. Please try again later.', true);
            })
            .finally(() => setLoading(false));
    }, [showFloatingMessage]); 

    const handleDeleteClick = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        axios.post('http://localhost/ustp-student-attendance/api/admin-backend/delete_course.php', {
            _method: 'DELETE',
            course_id: selectedCourse.course_id,
        })
            .then((res) => {
                if (res.data.success) {
                    setCourses(courses.filter(c => c.course_id !== selectedCourse.course_id));
                    showFloatingMessage('Course deleted successfully!', false);
                } else {
                    showFloatingMessage(res.data.message || "Failed to delete course.", true);
                }
            })
            .catch((err) => {
                console.error("Error deleting course:", err);
                showFloatingMessage("An error occurred while deleting the course. Please try again.", true);
            })
            .finally(() => {
                setIsModalOpen(false);
                setSelectedCourse(null);
            });
    };

    const filteredCourses = courses.filter(course =>
        (course.course_code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (course.course_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex overflow-auto scrollbar-thin">
            {/* Floating message */}
            {floatingMessage && (
                <div className={`fixed top-4 right-4 p-3 rounded-md shadow-lg z-50 transition-opacity duration-300 ${isFloatingMessageError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {floatingMessage}
                </div>
            )}

            <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">
                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={
                        !loading
                            ? {
                                backgroundImage: "url('/assets/teacher_vector.png')",
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
                            </div>
                        ) : (
                            <h1 className="text-2xl text-blue-700 font-bold">Course List</h1>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <p className="text-blue-700 font-semibold whitespace-nowrap">
                            Total Courses: {filteredCourses.length}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
                            />
                            <button
                                onClick={() => navigate("/admin-courses/add")}
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
                            >
                                + Add Course
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading courses...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full text-sm text-left text-blue-900 border-collapse table-fixed w-full">
                                <thead className="items-center bg-blue-100 uppercase text-blue-700">
                                    <tr>
                                        <th className="px-3 py-2 w-[15%]">Course Code</th>
                                        <th className="px-3 py-2 w-[20%]">Course Name</th>
                                        <th className="px-3 py-2 w-[50%]">Description</th>
                                        <th className="px-3 py-2 w-[15%] text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                                No courses found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCourses.map((course) => (
                                            <tr
                                                key={course.course_id ?? course.course_code}
                                                className="border-b border-blue-200 hover:bg-blue-50"
                                            >
                                                <td className="px-3 py-2 truncate min-w-0">{course.course_code}</td>
                                                <td className="px-3 py-2 truncate min-w-0">{course.course_name}</td>
                                                <td className="px-3 py-2 truncate min-w-0">{course.description}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                                                        <button
                                                            onClick={() => navigate(`/admin-courses/edit/${course.course_id}`)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(course)}
                                                            className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm w-full sm:w-auto"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {isModalOpen && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Delete
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the course {" "}
                            <span className="font-bold">{selectedCourse.course_code}: {selectedCourse.course_name}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MessageModal Component */}
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={closeMessageModal}
                title={messageModalTitle}
                message={messageModalMessage}
                type={messageModalType}
            />
        </div>
    );
}