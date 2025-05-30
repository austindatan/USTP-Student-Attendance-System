import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

function SectionCourses() {
    const { sectionId } = useParams();
    const navigate = useNavigate();
    const [sectionDetails, setSectionDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSectionCourses = async () => {
            try {
                // Adjust API endpoint to your backend path
                const response = await axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/section_courses.php?section_id=${sectionId}`);
                console.log("Fetched section courses data:", response.data);
                if (response.data.success) {
                    setSectionDetails(response.data.section);
                    setCourses(response.data.courses);
                } else {
                    setError(response.data.message || 'Failed to fetch section courses.');
                }
            } catch (err) {
                console.error("Error fetching section courses:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSectionCourses();
    }, [sectionId]);

    const handleEditCourse = (sectionCourseId) => {
        navigate(`/sections/${sectionId}/courses/${sectionCourseId}/edit`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Loading section courses...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-red-600 text-lg">Error: {error}</div>
            </div>
        );
    }

    if (!sectionDetails) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-gray-600 text-lg">Section not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Courses for {sectionDetails.section_name}</h1>
                <div className="text-lg text-gray-700 mb-6 text-center">
                    <p>Year Level: <span className="font-semibold">{sectionDetails.year_level_name || 'N/A'}</span></p>
                    <p>Semester: <span className="font-semibold">{sectionDetails.semester_name || 'N/A'}</span></p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center text-gray-600 text-lg">No courses assigned to this section.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Course Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Schedule Day</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Start Time</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">End Time</th>
                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {courses.map((course) => (
                                    <tr key={course.section_course_id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.course_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.schedule_day}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.start_time}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.end_time}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleEditCourse(course.section_course_id)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(-1)} // Changed to navigate(-1) to go back one step in history
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                        Back to Sections
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SectionCourses;
