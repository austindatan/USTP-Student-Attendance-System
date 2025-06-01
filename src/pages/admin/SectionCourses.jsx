import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SectionCourses() {
    const { sectionId } = useParams(); // sectionId is correctly retrieved here
    const navigate = useNavigate();
    const [sectionDetails, setSectionDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
    const [courseToDelete, setCourseToDelete] = useState(null); // State to store course to be deleted

    const handleNavigate = (path) => {
        navigate(path);
    };

    const fetchSectionCourses = async () => {
        try {
            const response = await axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/section_courses.php?section_id=${sectionId}`);
            console.log("Fetched section courses data:", response.data);
            if (response.data.success) {
                setSectionDetails(response.data.section);
                setCourses(response.data.courses);
            } else {
                setError(response.data.message || 'Failed to fetch section courses.');
            }
        } catch (err) {
            console.error("Error fetching section courses:", err); // Log the actual error
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSectionCourses();
    }, [sectionId]); // Re-fetch when sectionId changes

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!courseToDelete) return;

        try {
            const response = await axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/delete_sectioncourse.php', {
                _method: 'DELETE', // Laravel/PHP friendly method override
                section_course_id: courseToDelete.section_course_id,
            });

            if (response.data.success) {
                // Filter out the deleted course from the state
                setCourses(courses.filter(course => course.section_course_id !== courseToDelete.section_course_id));
                console.log(response.data.message);
            } else {
                console.error(response.data.message || "Failed to delete section course.");
                setError(response.data.message || "Failed to delete section course."); // Display error to user
            }
        } catch (err) {
            console.error("An error occurred while deleting the course:", err);
            setError("An error occurred while deleting the course. Please try again.");
        } finally {
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
        }
    };

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex overflow-auto scrollbar-thin">
            <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">
                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={{
                        backgroundImage: "url('assets/teacher_vector.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right",
                        backgroundSize: "contain"
                    }}
                >
                    {loading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="w-1/3 h-4 bg-white/50 rounded"></div>
                            <div className="w-1/2 h-8 bg-white/60 rounded"></div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl text-blue-700 font-bold mb-2">
                                Courses for Section {sectionDetails?.section_name || 'N/A'}
                            </h1>
                            <div className="text-lg text-gray-700">
                                <p>Year Level: <span className="font-semibold">{sectionDetails?.year_level_name || 'N/A'}</span></p>
                                <p>Semester: <span className="font-semibold">{sectionDetails?.semester_name || 'N/A'}</span></p>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => handleNavigate(`/sections/${sectionId}/courses/add`)}
                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                        >
                            + Add Courses
                        </button>
                    </div>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading section courses...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : courses.length === 0 ? (
                        <div className="text-center text-gray-600 text-lg">No courses assigned to this section.</div>
                    ) : (
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full text-sm text-left text-blue-900 border-collapse table-fixed w-full">
                                <thead className="bg-blue-100 uppercase text-blue-700">
                                    <tr>
                                        <th className="px-3 py-2 w-[25%]">Course Name</th>
                                        <th className="px-3 py-2 w-[25%]">Instructor</th>
                                        <th className="px-3 py-2 w-[15%]">Schedule Day</th>
                                        <th className="px-3 py-2 w-[15%]">Start Time</th>
                                        <th className="px-3 py-2 w-[10%]">End Time</th>
                                        <th className="px-3 py-2 w-[10%] text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.section_course_id} className="border-b border-blue-200 hover:bg-blue-50">
                                            <td className="px-3 py-2 truncate">{course.course_name}</td>
                                            <td className="px-3 py-2 truncate">
                                                {course.instructor_firstname && course.instructor_lastname
                                                    ? `${course.instructor_firstname} ${course.instructor_lastname}`
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-3 py-2">{course.schedule_day}</td>
                                            <td className="px-3 py-2">{course.start_time}</td>
                                            <td className="px-3 py-2">{course.end_time}</td>
                                            <td className="px-3 py-2 text-center">
                                                <div className="flex gap-1 justify-center items-center">
                                                    <button
                                                        onClick={() => navigate(`/sections/${sectionId}/courses/${course.section_course_id}/edit`)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(course)}
                                                        className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-6 text-right">
                        <button
                            onClick={() => handleNavigate("/admin-sections")}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
                        >
                            Back to Sections
                        </button>
                    </div>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && courseToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Delete
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the course{" "}
                            <span className="font-bold">{courseToDelete.course_name}</span> from this section?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
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
        </div>
    );
}

export default SectionCourses;