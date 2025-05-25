import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiSettings } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function Teacher_Dashboard({ selectedDate }) {
    const navigate = useNavigate();
    const { sectionId } = useParams();
    const [students, setStudents] = useState([]);
    const [presentStudents, setPresentStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Initialize sectionInfo from location.state if available, otherwise null
    const location = useLocation();
    const [sectionInfo, setSectionInfo] = useState(location.state?.sectionInfo || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedStudentForRequest, setSelectedStudentForRequest] = useState('');
    const [requestType, setRequestType] = useState('Excuse');
    const [requestReason, setRequestReason] = useState('');

    const instructor = JSON.parse(localStorage.getItem('instructor'));

    useEffect(() => {
        if (!instructor) {
            navigate('/login-instructor');
        }
    }, [instructor, navigate]);

    // Fetch section info for header (only if not passed via location state)
    useEffect(() => {
        // If sectionInfo is already available from location.state, no need to fetch again
        if (!sectionInfo && sectionId) {
            async function fetchSectionInfo() {
                try {
                    const res = await fetch(`http://localhost/ustp-student-attendance/instructor_backend/get_section_info.php?section_id=${sectionId}`);
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    const data = await res.json();
                    setSectionInfo(data);
                } catch (err) {
                    console.error("Error fetching section info:", err);
                    // Handle error state for section info, maybe show a generic header
                }
            }
            fetchSectionInfo();
        }
    }, [sectionId, sectionInfo]); // Added sectionInfo to dependency array to prevent unnecessary fetches

    useEffect(() => {
        if (!instructor?.instructor_id) return;

        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                const dateStr = format(selectedDate || new Date(), 'yyyy-MM-dd');
                const response = await fetch(
                    `http://localhost/ustp-student-attendance/instructor_backend/get_students.php?date=${dateStr}&instructor_id=${instructor.instructor_id}&section_id=${sectionId}&_t=${new Date().getTime()}` // Added cache busting
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setStudents(data);

                const presentIds = data.filter(student => student.status === 'Present').map(s => s.student_details_id);
                setPresentStudents(presentIds);
                setTimeout(() => setIsLoading(false), 1500);
            } catch (error) {
                console.error("Error fetching students:", error);
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [selectedDate, instructor?.instructor_id, sectionId]);

    const toggleAttendance = async (student) => {
        const updatedList = presentStudents.includes(student.student_details_id)
            ? presentStudents.filter(id => id !== student.student_details_id)
            : [...presentStudents, student.student_details_id];

        setPresentStudents(updatedList);

        const attendanceData = {
            student_details_id: student.student_details_id,
            instructor_id: instructor.instructor_id,
            section_id: student.section_id,
            program_details_id: student.program_details_id,
            admin_id: student.admin_id,
            date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
            status: updatedList.includes(student.student_details_id) ? 'Present' : 'Absent',
        };

        try {
            const res = await fetch('http://localhost/ustp-student-attendance/instructor_backend/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData)
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            console.log('Attendance saved:', result);
        } catch (error) {
            console.error('Error saving attendance:', error);
            // Optionally revert the UI state if saving fails
            setPresentStudents(currentList =>
                currentList.includes(student.student_details_id)
                    ? currentList.filter(id => id !== student.student_details_id)
                    : [...currentList, student.student_details_id]
            );
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleAddRequest = async () => {
        // Find the attendance_id for the selected student on the current date
        const studentAttendance = students.find(s => s.student_details_id === parseInt(selectedStudentForRequest));

        if (!studentAttendance) {
            alert('Student attendance record not found for the selected date. Please ensure the student has an attendance record before making a request.');
            return;
        }

        if (!selectedStudentForRequest || !requestReason) {
            alert('Please select a student and provide a reason for the request.');
            return;
        }

        const requestData = {
            attendance_id: studentAttendance.attendance_id,
            reason: requestReason,
            status: 'Pending', // Default status
        };

        let endpoint = '';
        if (requestType === 'Excuse') {
            endpoint = 'http://localhost/ustp-student-attendance/instructor_backend/add_excused_request.php';
        } else if (requestType === 'Drop') {
            endpoint = 'http://localhost/ustp-student-attendance/instructor_backend/add_drop_request.php';
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const result = await res.json();
            console.log('Request saved:', result);
            alert('Request submitted successfully!');
            setShowRequestModal(false);
            setSelectedStudentForRequest('');
            setRequestType('Excuse');
            setRequestReason('');
            // Potentially re-fetch students to update their status if the request changes it immediately
            // fetchStudents(); // This would re-run the useEffect
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request.');
        }
    };

    return (
        <div className="min-h-screen flex hide-scrollbar overflow-scroll">
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12">
                {/* HEADER */}
                {isLoading ? (
                    <div className="bg-white rounded-lg p-6 mb-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ) : (
                    <div
                        className="bg-[#0097b2] rounded-lg p-6 text-white font-poppins mb-6 relative"
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/classes_vector_2.png)`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 50px center",
                            backgroundSize: "contain",
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => navigate("/classes-dashboard")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <FiSettings className="text-xl cursor-pointer" />
                        </div>
                        <div>
                            {/* Adjusted to display course_name as main title and section_name below it */}
                            <h1 className="text-2xl font-bold">
                                {sectionInfo?.course_name || 'Course Title'}
                            </h1>
                            <h2 className="text-xl font-semibold">
                                {sectionInfo?.section_name || 'Section Name'}
                            </h2>
                            <p className="text-sm">{sectionInfo?.course_code || 'Course Code'}</p>
                            <p className="text-sm">
                                {sectionInfo ? `${sectionInfo.schedule_day} ${sectionInfo.start_time} - ${sectionInfo.end_time}` : ''}
                            </p>
                        </div>
                    </div>
                )}

                {/* Search and Add Request Button */}
                {isLoading ? (
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative w-80 h-10 rounded-lg bg-white animate-pulse"></div>
                        <div className="w-32 h-10 rounded-lg bg-white animate-pulse"></div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative w-80">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search"
                                className="font-poppins block w-full ps-10 py-2 text-sm text-white rounded-lg bg-[#0097b2] focus:ring-pink-500 focus:border-pink-500 placeholder-white/50"
                                placeholder="Search for students."
                            />
                        </div>
                        <button
                            onClick={() => setShowRequestModal(true)}
                            className="font-poppins px-4 py-2 text-sm rounded-lg border-2 border-[#0097b2] bg-white text-[#0097b2] hover:bg-[#e4eae9] hover:border-[#007b8e] hover:text-[#007b8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097b2]"
                        >
                            Add Request
                        </button>
                    </div>
                )}

                {/* Student Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full mt-6 mb-6">
                    {isLoading
                        ? Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`cursor-pointer animate-pulse bg-white border-2 border-[#e4eae9] rounded-[20px] flex flex-col justify-between w-24 sm:w-36`}>
                                <div className="overflow-hidden rounded-t-[20px] flex justify-center">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/white_placeholder2.jpg`}
                                        className="w-full h-full object-cover grayscale"
                                        alt="Loading..."
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="font-[Barlow] text-xs font-bold ml-[5px] text-[#737373] bg-gray-200 rounded h-4 mb-2"></p>
                                    <div className="flex items-center justify-between">
                                        <div className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2] bg-gray-200 rounded w-2/3 h-4"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                        : filteredStudents.map((student, index) => {
                            const isPresent = presentStudents.includes(student.student_details_id);
                            const name = student.name || 'No Name';
                            return (
                                <div
                                    key={index}
                                    onClick={() => toggleAttendance(student)}
                                    className={`cursor-pointer transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]
                                        bg-white border-2 border-[#e4eae9] rounded-[20px] flex flex-col justify-between
                                        ${isPresent ? 'opacity-100' : 'opacity-60'}`}
                                >
                                    <div className="overflow-hidden rounded-t-[20px] flex justify-center">
                                        <img
                                            src={`http://localhost/ustp-student-attendance/api/${student.image}?${new Date().getTime()}`} // Added cache busting
                                            className={`w-full h-36 object-cover ${isPresent ? '' : 'grayscale'}`}
                                            alt={name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `${process.env.PUBLIC_URL}/assets/white_placeholder2.jpg`;
                                                console.warn(`Failed to load image for ${name}. Using fallback.`);
                                            }}
                                        />
                                    </div>
                                    <div className="pl-3 pr-4 pt-2 pb-4 items-center">
                                        <p className={`font-[Barlow] text-xs font-poppins font-bold ml-[5px]
                                            ${isPresent ? 'text-[#0097b2]' : 'text-[#737373]'}`}>
                                            {isPresent ? 'Present' : 'Absent'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2]">
                                                {name.includes(" ") ? (
                                                    <>
                                                        {name.split(" ")[0]} <br /> {name.split(" ")[1]}
                                                    </>
                                                ) : name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </section>

            {/* Request Modal */}
            {showRequestModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowRequestModal(false)} // Click outside to close
                >
                    <div
                        className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md mx-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
                    >
                        <h2 className="text-xl font-bold text-[#0097b2] mb-4">Add Request</h2>

                        {/* Student Dropdown */}
                        <div className="mb-4">
                            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Student:
                            </label>
                            <select
                                id="student-select"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#0097b2] focus:border-[#0097b2] sm:text-sm text-[#737373]"
                                value={selectedStudentForRequest}
                                onChange={(e) => setSelectedStudentForRequest(e.target.value)}
                            >
                                <option value="">-- Choose a student --</option>
                                {students.map((student) => (
                                    <option key={student.student_details_id} value={student.student_details_id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Request Type Radio Buttons */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Request Type:
                            </label>
                            <div className="mt-1 flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-[#0097b2] focus:ring-[#0097b2]"
                                        name="requestType"
                                        value="Excuse"
                                        checked={requestType === 'Excuse'}
                                        onChange={(e) => setRequestType(e.target.value)}
                                    />
                                    <span className="ml-2 text-gray-700">Excuse</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-[#0097b2] focus:ring-[#0097b2]"
                                        name="requestType"
                                        value="Drop"
                                        checked={requestType === 'Drop'}
                                        onChange={(e) => setRequestType(e.target.value)}
                                    />
                                    <span className="ml-2 text-gray-700">Drop</span>
                                </label>
                            </div>
                        </div>

                        {/* Reason Textarea */}
                        <div className="mb-6">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                Reason:
                            </label>
                            <textarea
                                id="reason"
                                rows="4"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0097b2] focus:border-[#0097b2] sm:text-sm text-[#737373]"
                                value={requestReason}
                                onChange={(e) => setRequestReason(e.target.value)}
                                placeholder="Enter reason for the request..."
                            ></textarea>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRequest}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#0097b2] rounded-md hover:bg-[#007b8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097b2]"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}