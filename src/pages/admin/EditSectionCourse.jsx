// Refactored EditSectionCourse.jsx to match EditSection.jsx frontend
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../components/confirmationmodal';

function EditSectionCourse() {
    const { sectionId, sectionCourseId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        course_id: '',
        schedule_day: '',
        start_time: '',
        end_time: '',
        instructor_id: ''
    });
    const [currentCourseName, setCurrentCourseName] = useState('');
    const [allCourses, setAllCourses] = useState([]);
    const [allInstructors, setAllInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesRes = await axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/courses_list.php');
                if (coursesRes.data.success) setAllCourses(coursesRes.data.courses);

                const instructorsRes = await axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_all_instructors.php');
                if (instructorsRes.data.success) setAllInstructors(instructorsRes.data.instructors);

                const sectionCourseRes = await axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/edit_section_course.php?section_course_id=${sectionCourseId}`);
                if (sectionCourseRes.data.success) {
                    const { course_id, schedule_day, start_time, end_time, course_name, instructor_id } = sectionCourseRes.data.sectionCourse;
                    setFormData({ course_id, schedule_day, start_time, end_time, instructor_id: instructor_id || '' });
                    setCurrentCourseName(course_name);
                } else {
                    setError(sectionCourseRes.data.message || 'Failed to load section course data.');
                }
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sectionCourseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setIsSaving(true);
        try {
            const res = await axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/edit_section_course.php', {
                ...formData,
                section_course_id: sectionCourseId
            });
            if (res.data.success) {
                navigate(`/sections/${sectionId}/courses`);
            } else {
                setError(res.data.message || 'Failed to update section course.');
            }
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
            setIsModalOpen(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
                <div className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={{
                        backgroundImage: "url('assets/teacher_vector.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right',
                        backgroundSize: 'contain'
                    }}>
                    <h1 className="text-2xl text-blue-700 font-bold">Edit Section Course</h1>
                </div>

                <div className="bg-white shadow-md p-8 rounded-lg">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Course Name</label>
                            <select
                                name="course_id"
                                value={formData.course_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a Course</option>
                                {allCourses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Instructor</label>
                            <select
                                name="instructor_id"
                                value={formData.instructor_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Instructor</option>
                                {allInstructors.map((instructor) => (
                                    <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                        {`${instructor.firstname} ${instructor.lastname}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Schedule Day</label>
                            <select
                                name="schedule_day"
                                value={formData.schedule_day}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a day</option>
                                {["Monday & Tuesday", "Monday & Wednesday", "Monday & Thursday", "Monday & Friday", "Monday & Saturday", "Tuesday & Wednesday", "Tuesday & Thursday", "Tuesday & Friday", "Tuesday & Saturday", "Wednesday & Thursday", "Wednesday & Friday", "Wednesday & Saturday", "Thursday & Friday", "Thursday & Saturday", "Friday & Saturday"].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Start Time</label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">End Time</label>
                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(`/sections/${sectionId}/courses`)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                            >
                                Update Section Course
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="Confirm Edit"
                message={`Are you sure you want to update the course "${currentCourseName}" for this section?`}
                confirmText="Update Section Course"
                loading={isSaving}
                confirmButtonClass="bg-blue-700 hover:bg-blue-800"
            />
        </div>
    );
}

export default EditSectionCourse;
