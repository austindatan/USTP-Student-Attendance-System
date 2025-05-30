import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

function EditSectionCourse() {
    const { sectionId, sectionCourseId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        course_id: '',
        schedule_day: '',
        start_time: '',
        end_time: ''
    });
    const [currentCourseName, setCurrentCourseName] = useState('');
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all courses for the dropdown
                const coursesResponse = await axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/courses_list.php'); // Adjust API endpoint
                if (coursesResponse.data.success) {
                    setAllCourses(coursesResponse.data.courses);
                } else {
                    setError(coursesResponse.data.message || 'Failed to fetch courses list.');
                    setLoading(false);
                    return;
                }

                // Fetch specific section course details
                const sectionCourseResponse = await axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/edit_section_course.php?section_course_id=${sectionCourseId}`); // Adjust API endpoint
                if (sectionCourseResponse.data.success) {
                    const { course_id, schedule_day, start_time, end_time, course_name } = sectionCourseResponse.data.sectionCourse;
                    setFormData({
                        course_id: course_id,
                        schedule_day: schedule_day,
                        start_time: start_time,
                        end_time: end_time
                    });
                    setCurrentCourseName(course_name);
                } else {
                    setError(sectionCourseResponse.data.message || 'Failed to fetch section course details.');
                }
            } catch (err) {
                console.error("Error fetching data for edit:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sectionCourseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setError(''); // Clear previous errors
        try {
            const response = await axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/edit_section_course.php', { // Adjust API endpoint
                ...formData,
                section_course_id: sectionCourseId
            });

            if (response.data.success) {
                setMessage(response.data.message);
                // Optionally navigate back after a short delay
                setTimeout(() => navigate(-1), 2000); // Changed to navigate(-1)
            } else {
                setError(response.data.message || 'Failed to update section course.');
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Loading course details...</div>
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

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Section Course</h1>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                        <select
                            id="course_id"
                            name="course_id"
                            value={formData.course_id}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        >
                            <option value="">Select a Course</option>
                            {allCourses.map((course) => (
                                <option key={course.course_id} value={course.course_id}>
                                    {course.course_name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Current Course: <span className="font-semibold">{currentCourseName}</span></p>
                    </div>

                    <div>
                        <label htmlFor="schedule_day" className="block text-sm font-medium text-gray-700 mb-1">Schedule Day</label>
                        <input
                            type="text"
                            id="schedule_day"
                            name="schedule_day"
                            value={formData.schedule_day}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                            type="time"
                            id="start_time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                            type="time"
                            id="end_time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // Changed to navigate(-1) to go back one step in history
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSectionCourse;
