import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom'; // Import createPortal for modals

const AddExcuseRequest = ({ studentId }) => {
    console.log("AddExcuseRequest (render): received studentId prop =", studentId);

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [selectedStudentDetailsId, setSelectedStudentDetailsId] = useState('');
    const [instructor, setInstructor] = useState(null);
    const [instructorId, setInstructorId] = useState('');
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);
    const [dateOfAbsence, setDateOfAbsence] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // State for confirmation modal
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    // New state for success modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    useEffect(() => {
        console.log("AddExcuseRequest (useEffect): studentId in dependency array =", studentId);

        const fetchCourses = async () => {
            try {
                const res = await axios.get(
                    `http://localhost/ustp-student-attendance-system/api/student_backend/get_student_courses.php?student_id=${studentId}`
                );

                console.log("API response:", res.data);

                if (res.data?.success && res.data.courses.length > 0) {
                    setCourses(res.data.courses);
                    setError('');
                } else if (res.data?.success && res.data.courses.length === 0) {
                    setCourses([]);
                    setError('No courses found for this student.');
                } else {
                    setError('Failed to load courses.');
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setMessage("Error loading courses.");
                setSuccess(false);
            }
        };

        if (studentId) {
            console.log("AddExcuseRequest (useEffect): studentId is truthy, fetching courses...");
            fetchCourses();
        } else {
            console.log("AddExcuseRequest (useEffect): studentId is falsy, NOT fetching courses.");
        }
    }, [studentId]);


    useEffect(() => {
        const fetchInstructorByCourse = async () => {
            if (!courseId || !studentId) return;

            try {
                const res = await axios.get(`http://localhost/ustp-student-attendance-system/api/student_backend/get_instructor_by_course.php?student_id=${studentId}&course_id=${courseId}`);
                console.log("Instructor API response:", res.data);
                if (res.data.success && res.data.instructor) {
                    setInstructor(res.data.instructor);
                    setInstructorId(res.data.instructor.instructor_id);
                    console.log("Instructor ID set to:", res.data.instructor.instructor_id);
                } else {
                    setInstructor(null);
                    setInstructorId('');
                    setMessage("Instructor not found for selected course.");
                    setSuccess(false);
                    console.log("Instructor not found or API failed, instructorId reset.");
                }
            } catch (err) {
                console.error("Error fetching instructor:", err);
                setMessage("Error fetching instructor.");
                setSuccess(false);
            }
        };

        fetchInstructorByCourse();
    }, [courseId, studentId]);


    const handleCourseChange = (e) => {
        const selectedCourseId = e.target.value;
        setCourseId(selectedCourseId);
        setInstructor(null);
        setInstructorId('');
        setMessage('');
        setSuccess(null);

        const selectedCourse = courses.find(course => course.course_id.toString() === selectedCourseId);
        if (selectedCourse) {
            setSelectedStudentDetailsId(selectedCourse.student_details_id);
            console.log("Selected course student_details_id:", selectedCourse.student_details_id);
        } else {
            setSelectedStudentDetailsId('');
            console.log("No course found for selected ID, student_details_id reset.");
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation before opening modal
        if (!selectedStudentDetailsId || !instructorId || !reason || !dateOfAbsence) {
            setMessage("Please fill in all required fields (Course, Instructor, Reason, Date of Absence).");
            setSuccess(false);
            return; // Stop here, do not open modal
        }

        // Open confirmation modal
        setShowConfirmationModal(true);
    };

    const confirmSubmit = async () => {
        setShowConfirmationModal(false); // Close the confirmation modal
        setLoading(true);
        setMessage('');
        setSuccess(null);

        const formData = new FormData();
        formData.append('student_details_id', selectedStudentDetailsId);
        formData.append('instructor_id', instructorId);
        formData.append('reason', reason);
        formData.append('file', file);
        formData.append('date_of_absence', dateOfAbsence);

        console.log("Preparing to submit form with FormData (after confirmation):");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const res = await axios.post('http://localhost/ustp-student-attendance-system/api/student_backend/submit_excuse_request.php', formData);
            setMessage(res.data.message);
            const isSuccess = res.data.success === true || res.data.success === "true";
            setSuccess(isSuccess);

            if (isSuccess) {
                // Instead of navigating immediately, show success modal
                setShowSuccessModal(true);
                // Reset form fields, but don't navigate yet
                setCourseId('');
                setSelectedStudentDetailsId('');
                setInstructor(null);
                setInstructorId('');
                setReason('');
                setFile(null);
                setDateOfAbsence('');
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error("Axios submission error:", err);
            if (err.response) {
                setMessage(`Server Error: ${err.response.data.message || err.response.statusText}`);
            } else if (err.request) {
                setMessage("Network Error: No response from server. Check your connection.");
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle closing success modal and navigating
    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/student-dashboard'); // Navigate after user acknowledges success
    };

    return (
        <div className="font-dm-sans min-h-screen overflow-y-auto">
            <section className="lg:w-[75%] xl:w-[76%] w-full pt-12 px-6 sm:px-6 md:px-12">
                <form
                    onSubmit={handleSubmit} // This now just opens the modal
                    className="font-dm-sans p-8 text-left w-full max-w-xl mx-auto my-10 bg-white rounded-xl shadow-2xl transition-all duration-300 space-y-6"
                >
                    {/* Form Title */}
                    <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 border-b pb-4 border-blue-100">Excuse Request Form</h2>

                    {/* Message Display (Success/Error) */}
                    {message && (
                        <div className={`p-4 rounded-lg border text-center font-medium ${success ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}>
                            {message}
                        </div>
                    )}

                    {/* Course Selection */}
                    <div>
                        <label htmlFor="course" className="block mb-2 font-semibold text-blue-700">Course</label>
                        <select
                            id="course"
                            value={courseId}
                            onChange={handleCourseChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
                            ))}
                        </select>
                        {error && courses.length === 0 && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    {/* Instructor Display */}
                    <div>
                        <label htmlFor="instructor" className="block mb-2 font-semibold text-blue-700">Instructor</label>
                        <input
                            id="instructor"
                            type="text"
                            value={instructor ? `${instructor.firstname} ${instructor.lastname}` : ''}
                            readOnly
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* Reason Textarea */}
                    <div>
                        <label htmlFor="reason" className="block mb-2 font-semibold text-blue-700">Reason for Absence</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            required
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-y text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                            placeholder="E.g., Medical appointment, family emergency, etc."
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label htmlFor="file" className="block mb-2 font-semibold text-blue-700">Upload Supporting Document (Optional)</label>
                        <input
                            id="file"
                            type="file"
                            onChange={e => setFile(e.target.files[0])}
                            className="w-full text-gray-700 focus:outline-none
                                         file:mr-4 file:py-2 file:px-4
                                         file:rounded-full file:border-0
                                         file:text-sm file:font-semibold
                                         file:bg-blue-50 file:text-blue-700
                                         hover:file:bg-blue-100 transition duration-200"
                            ref={fileInputRef}
                        />
                    </div>

                    {/* Date of Absence */}
                    <div>
                        <label htmlFor="dateOfAbsence" className="block mb-2 font-semibold text-blue-700">Date of Absence</label>
                        <input
                            id="dateOfAbsence"
                            type="date"
                            value={dateOfAbsence}
                            onChange={e => setDateOfAbsence(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit" // This button now triggers the modal
                        disabled={loading}
                        className={`w-full text-white font-bold py-3 rounded-lg transition-all duration-300 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 shadow-md"
                        }`}
                    >
                        {loading ? "Submitting Request..." : "Submit Excuse Request"}
                    </button>
                </form>
            </section>

            {/* Confirmation Modal */}
            {showConfirmationModal && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-dm-sans">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 text-center">Confirm Submission</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            Are you sure you want to submit this excuse request?
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSubmit}
                                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Success Modal */}
            {showSuccessModal && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-dm-sans">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">Success!</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            Your excuse request has been submitted successfully.
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={handleSuccessModalClose} // Call the new handler
                                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AddExcuseRequest;