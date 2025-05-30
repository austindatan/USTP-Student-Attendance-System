import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { FiSettings } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function Teacher_Dashboard({ selectedDate }) {
    const navigate = useNavigate();
    const { sectionId } = useParams();
    const [students, setStudents] = useState([]);
    const [presentStudents, setPresentStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [sectionInfo, setSectionInfo] = useState(location.state?.sectionInfo || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedStudentForRequest, setSelectedStudentForRequest] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [dropdownStudents, setDropdownStudents] = useState([]);
    const [showColorModal, setShowColorModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState(sectionInfo?.hexcode || '#0097b2');
    const colorModalRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const [lateStudents, setLateStudents] = useState([]);
    const [isAttendanceLocked, setIsAttendanceLocked] = useState(false); // Attendance locked state
    const [showUnlockModal, setShowUnlockModal] = useState(false); // State for unlock modal
    const [unlockPasscode, setUnlockPasscode] = useState('');
  

    const instructor = JSON.parse(localStorage.getItem('instructor'));

    console.log("DEBUG (Top Level): Initial selectedDate state:", selectedDate);
    console.log("DEBUG (Top Level): Initial isAttendanceLocked state:", isAttendanceLocked);
    console.log("sectionInfo (top level):", sectionInfo);
    console.log("Image (top level):", sectionInfo?.image);

    // Helper function to format 24-hour time to 12-hour AM/PM
    const formatTime = (timeString24hr) => {
        if (!timeString24hr) {
            return '';
        }

        try {
            const [hours, minutes, seconds] = timeString24hr.split(':');

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                throw new Error("Invalid time components");
            }

            // We'll use a dummy date for the Date object as only the time is relevant
            const dummyDate = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes), parseInt(seconds));

            const options = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true // This is the key for 12-hour format with AM/PM
            };

            // Using 'en-US' for consistent AM/PM formatting.
            return dummyDate.toLocaleTimeString('en-US', options);
        } catch (error) {
            console.error("Error formatting time string:", timeString24hr, error);
            return timeString24hr; // Fallback to original string on error
        }
    };

    // Helper to get day name from selectedDate
    const getDayName = (date) => {
        console.log("DEBUG: getDayName - selectedDate (inside helper):", date);
        const dayName = format(date || new Date(), 'EEEE'); // e.g., "Monday"
        console.log("DEBUG: getDayName - Day Name (inside helper):", dayName);
        return dayName;
    };

    // Helper to check if today is a scheduled class day
    const isClassDay = () => {
        console.log("DEBUG: isClassDay - sectionInfo:", sectionInfo);
        console.log("DEBUG: isClassDay - sectionInfo?.schedule_day:", sectionInfo?.schedule_day);

        if (!sectionInfo?.schedule_day) {
            console.log("DEBUG: isClassDay - No schedule_day found in sectionInfo. Returning false.");
            return false;
        }

        const scheduledDays = sectionInfo.schedule_day
            .split(' & ')
            .map(day => day.trim().toLowerCase());
        console.log("DEBUG: isClassDay - Parsed scheduledDays:", scheduledDays);

        const today = getDayName(selectedDate).toLowerCase();
        console.log("DEBUG: isClassDay - Current 'today' (from selectedDate):", today);

        const result = scheduledDays.includes(today);
        console.log("DEBUG: isClassDay - Does scheduledDays include 'today'?", result);
        return result;
    };

    useEffect(() => {
        if (!instructor) {
            navigate('/login-instructor');
        }
    }, [instructor, navigate]);

    // Fetch section info for header (only if not passed via location state)
    useEffect(() => {
        console.log("DEBUG (fetchSectionInfo useEffect): Fetching section info for sectionId:", sectionId);
        if (!sectionInfo && sectionId) {
            async function fetchSectionInfo() {
                try {
                    const res = await fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_section_info.php?section_id=${sectionId}`);
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    const data = await res.json();
                    setSectionInfo(data);
                    console.log("DEBUG (fetchSectionInfo): Section info set:", data);
                } catch (err) {
                    console.error("Error fetching section info:", err);
                }
            }
            fetchSectionInfo();
        }
    }, [sectionId, sectionInfo]);

    // Fetch attendance lock status
    useEffect(() => {
        console.log("DEBUG (fetchLockStatus useEffect): Running. sectionInfo:", sectionInfo, "selectedDate:", selectedDate);
        const fetchLockStatus = async () => {
            if (!sectionInfo || !sectionInfo.section_id || !selectedDate) {
                console.log("DEBUG (fetchLockStatus): Prerequisites not met. isAttendanceLocked set to false.");
                setIsAttendanceLocked(false);
                return;
            }

            try {
                const response = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/get_attendance_lock_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        section_id: sectionInfo.section_id,
                        date: format(selectedDate, 'yyyy-MM-dd'),
                    }),
                });
                const data = await response.json();
                if (data.success) {
                    setIsAttendanceLocked(data.is_locked);
                    console.log("DEBUG (fetchLockStatus): Lock status fetched:", data.is_locked);
                } else {
                    console.error("Failed to fetch lock status:", data.message);
                    setIsAttendanceLocked(false);
                }
            } catch (error) {
                console.error("Error fetching lock status:", error);
                setIsAttendanceLocked(false);
            }
        };

        fetchLockStatus();
    }, [sectionInfo, selectedDate]); // Dependencies

    useEffect(() => {
        console.log("DEBUG (fetchStudents useEffect): Running. selectedDate:", selectedDate, "instructor:", instructor, "section_courses_Id:", sectionId);
        if (!instructor?.instructor_id || !sectionId) {
            console.log("DEBUG (fetchStudents): Prerequisites not met for fetching students.");
            return;
        }

        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                const dateStr = format(selectedDate || new Date(), 'yyyy-MM-dd');
                console.log("DEBUG (fetchStudents): Fetching students for date:", dateStr);
                const response = await fetch(
                    `http://localhost/USTP-Student-Attendance-System/instructor_backend/get_students.php?date=${dateStr}&instructor_id=${instructor.instructor_id}&section_id=${sectionId}&_t=${new Date().getTime()}` // Added cache busting
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setStudents(data);
                console.log("DEBUG (fetchStudents): Students fetched:", data);

                const presentIds = data.filter(student => student.status === 'Present').map(s => s.student_details_id);
                setPresentStudents(presentIds);
                const lateIds = data.filter(student => student.status === 'Late').map(s => s.student_details_id);
                setLateStudents(lateIds);
                setTimeout(() => setIsLoading(false), 1500);
            } catch (error) {
                console.error("Error fetching students:", error);
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [selectedDate, instructor?.instructor_id, sectionId]);

    const toggleAttendance = async (student) => {
        console.log("DEBUG: toggleAttendance function called for student:", student.student_details_id);

        if (isAttendanceLocked) {
            alert("Attendance for this session is locked and cannot be modified.");
            return;
        }

        const isPresent = presentStudents.includes(student.student_details_id);
        const isLate = lateStudents.includes(student.student_details_id);

        let newPresent = presentStudents;
        let newLate = lateStudents;
        let newStatus = 'Absent';

        if (isLate) {
            newLate = lateStudents.filter(id => id !== student.student_details_id);
            newPresent = presentStudents.filter(id => id !== student.student_details_id);
            newStatus = 'Absent';
        } else if (isPresent) {
            newPresent = presentStudents.filter(id => id !== student.student_details_id);
            newStatus = 'Absent';
        } else {
            newPresent = [...presentStudents, student.student_details_id];
            newLate = lateStudents.filter(id => id !== student.student_details_id);
            newStatus = 'Present';
        }

        setPresentStudents(newPresent);
        setLateStudents(newLate);

        const attendanceData = {
            student_details_id: student.student_details_id,
            section_id: sectionInfo.section_id,
            date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
            status: newStatus,
        };

        console.log("DEBUG (toggleAttendance): sectionInfo object:", sectionInfo);
        console.log("DEBUG (toggleAttendance): sectionInfo.section_id value:", sectionInfo?.section_id);
        console.log("DEBUG (toggleAttendance): Final attendanceData payload:", attendanceData);

        try {
            const res = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }

            const result = await res.json();
            console.log('Attendance saved:', result);
            if (!result.success) {
                alert("Failed to save attendance: " + result.message);
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Error saving attendance: ' + error.message);
        }
    };

    const filteredStudents = students.filter(student =>
        (student.name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchDropdownStudents = async () => {
            try {
                const res = await fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/student_dropdown.php?instructor_id=${instructor.instructor_id}&section_id=${sectionId}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setDropdownStudents(data);
            } catch (error) {
                console.error("Error fetching dropdown students:", error);
            }
        };

        fetchDropdownStudents();
    }, [instructor?.instructor_id, sectionId]);

    const markAsLate = async (student) => {
        if (isAttendanceLocked) {
            alert("Attendance for this session is locked and cannot be modified.");
            return;
        }

        const attendanceData = {
            student_details_id: student.student_details_id,
            section_id: sectionInfo.section_id,
            date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
            status: 'Late',
        };

        console.log("DEBUG (markAsLate): sectionInfo object:", sectionInfo);
        console.log("DEBUG (markAsLate): sectionInfo.section_id value:", sectionInfo?.section_id);
        console.log("DEBUG (markAsLate): Final attendanceData payload (Late):", attendanceData);

        try {
            const res = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }

            const result = await res.json();
            console.log('Marked as Late:', result);

            if (result.success) {
                setLateStudents((prev) => [...new Set([...prev, student.student_details_id])]);
                setPresentStudents((prev) => prev.filter(id => id !== student.student_details_id));
            } else {
                alert("Failed to mark as late: " + result.message);
            }
        } catch (error) {
            console.error('Error marking as late:', error);
            alert('Error marking as late: ' + error.message);
        }
    };

    const handleAddDropRequest = async () => {
        if (!selectedStudentForRequest || !requestReason.trim()) {
            alert("Please select a student and enter a reason.");
            return;
        }

        const requestData = {
            student_details_id: selectedStudentForRequest,
            reason: requestReason,
        };

        try {
            const res = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/add_drop_request.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                alert("Drop request submitted successfully.");
                setShowRequestModal(false);
                setSelectedStudentForRequest('');
                setRequestReason('');
            } else {
                alert("Failed to submit: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting the drop request.");
        }
    };

    // Function to handle unlocking attendance
    const handleUnlockAttendance = async () => {
        if (!unlockPasscode.trim()) {
            alert("Please enter the passcode.");
            return;
        }

        try {
            const response = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/unlock_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section_id: sectionInfo.section_id,
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    passcode: unlockPasscode,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert("Attendance unlocked successfully!");
                setIsAttendanceLocked(false); // Unlock attendance in UI
                setShowUnlockModal(false); // Close the modal
                setUnlockPasscode(''); // Clear the passcode input
            } else {
                alert("Failed to unlock attendance: " + (data.message || "Invalid passcode."));
            }
        } catch (error) {
            console.error("Error unlocking attendance:", error);
            alert("An error occurred while trying to unlock attendance.");
        }
    };


    console.log("DEBUG (Render): filteredStudents:", filteredStudents); // New debug log for every render

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
                        className="rounded-lg p-6 text-white font-poppins mb-6 relative"
                        style={{
                            backgroundColor: sectionInfo?.hexcode || '#0097b2',
                            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${sectionInfo?.image})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 20px center",
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
                            <div className="relative">
                                <FiSettings
                                    ref={settingsButtonRef}
                                    className="text-xl cursor-pointer"
                                    onClick={() => setShowColorModal(prev => !prev)}
                                />

                                {showColorModal && (
                                    <div ref={colorModalRef} className="absolute right-0 mt-2 w-60 bg-white p-4 rounded-lg shadow-xl z-50 text-center border border-gray-200">

                                        <h2 className="text-sectionInfo?.hexcode font-bold text-lg mb-4" style={{ color: sectionInfo?.hexcode }}>Change Section Color</h2>
                                        <input
                                            type="color"
                                            value={selectedColor}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="w-24 h-12 border rounded mb-4"
                                        />
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/update_section_color.php', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                section_id: sectionId,
                                                                hexcode: selectedColor
                                                            }),
                                                        });

                                                        const result = await res.json();
                                                        if (result.success) {
                                                            setSectionInfo(prev => ({ ...prev, hexcode: selectedColor }));
                                                            alert('Color updated successfully!');
                                                            setShowColorModal(false);
                                                        } else {
                                                            alert('Update failed: ' + (result.error || 'Unknown error'));
                                                        }
                                                    } catch (err) {
                                                        console.error('Failed to update color:', err);
                                                        alert('Error updating color.');
                                                    }
                                                }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setShowColorModal(false)}
                                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {sectionInfo?.course_name || 'Course Title (Missing)'}
                            </h1>
                            <h2 className="text-xl font-semibold">
                                {sectionInfo?.section_name || 'Section Name'}
                            </h2>
                            <p className="text-sm">{sectionInfo?.course_code || 'Course Code'}</p>
                            <p className="text-sm">
                                {sectionInfo ? `${sectionInfo.schedule_day} ${formatTime(sectionInfo.start_time)} - ${formatTime(sectionInfo.end_time)}` : ''}
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
                                className="font-poppins block w-full ps-10 py-2 text-sm text-white rounded-lg focus:ring-pink-500 focus:border-pink-500 placeholder-white/50"
                                placeholder="Search for students."
                                style={{ backgroundColor: sectionInfo?.hexcode || '#0097b2' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowRequestModal(true)}
                            className="font-poppins px-4 py-2 text-sm rounded-lg border-2 bg-white text-[#0097b2] hover:bg-[#e4eae9] hover:border-[#007b8e] hover:text-[#007b8e] focus:outline-none focus:ring-2 focus:ring-2 focus:ring-offset-2 focus:ring-[#0097b2]"
                            style={{ borderColor: sectionInfo?.hexcode || '#0097b2', color: sectionInfo?.hexcode || '#0097b2' }}
                        >
                            Add Request
                        </button>
                    </div>
                )}

                {/* Attendance Lock/Unlock Buttons */}
                {isClassDay() && (
                    <div className="flex justify-end gap-2 mb-4">
                        {!isAttendanceLocked ? (
                            <button
                                onClick={async () => {
                                    if (window.confirm("Are you sure you want to lock attendance for this section and date? This cannot be undone.")) {
                                        try {
                                            const response = await fetch('http://localhost/USTP-Student-Attendance-System/instructor_backend/lock_attendance.php', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    section_id: sectionInfo.section_id,
                                                    date: format(selectedDate, 'yyyy-MM-dd'),
                                                    lock_status: 1,
                                                }),
                                            });
                                            const data = await response.json();
                                            if (data.success) {
                                                alert(data.message);
                                                setIsAttendanceLocked(true);
                                            } else {
                                                alert("Failed to lock attendance: " + data.message);
                                            }
                                        } catch (error) {
                                            console.error("Error locking attendance:", error);
                                            alert("An error occurred while trying to lock attendance.");
                                        }
                                    }
                                }}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
                            >
                                Lock Attendance
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowUnlockModal(true)} // Show unlock modal
                                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-200"
                            >
                                Unlock Attendance
                            </button>
                        )}
                    </div>
                )}


                {/* Student Cards */}
                {isClassDay() ? (
                    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full mt-6 mb-6">
                        {isLoading
                            ? Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className={`cursor-pointer animate-pulse bg-white border-2 border-[#e4eae9] rounded-[20px] flex flex-col justify-between w-24 sm:w-36`}>
                                    <div className="overflow-hidden rounded-t-[20px] flex justify-center aspect-w-1 aspect-h-1 w-full">
                                        <img
                                            src={`${process.env.PUBLIC_URL}/assets/white_placeholder2.jpg`}
                                            className="object-cover grayscale"
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
                                const isLate = lateStudents.includes(student.student_details_id);

                                const firstName = student.firstname || '';
                                const middleName = student.middlename && student.middlename !== '-' ? student.middlename : '';
                                const lastName = student.lastname || '';

                                const displayedNameParts = [firstName, middleName, lastName].filter(Boolean);
                                const displayedName = displayedNameParts.join(' ');

                                return (
                                    <div
                                        key={index}
                                        onClick={isAttendanceLocked ? null : () => toggleAttendance(student)}
                                        onDoubleClick={isAttendanceLocked ? null : () => markAsLate(student)}
                                        className={`cursor-pointer transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]
                                             bg-white border-2 rounded-[20px] flex flex-col justify-between
                                            ${isLate ? 'border-yellow-400 bg-yellow-100 opacity-100' : isPresent ? 'border-[#e4eae9] opacity-100' : 'border-[#e4eae9] opacity-60'}
                                            ${isAttendanceLocked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                                        `}
                                    >
                                        {isAttendanceLocked && (
                                            <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full z-10">LOCKED</div>
                                        )}
                                        <div className="overflow-hidden rounded-t-[20px] flex justify-center aspect-w-1 aspect-h-1 w-full">
                                            <img
                                                src={`http://localhost/USTP-Student-Attendance-System/uploads/${student.image}?${new Date().getTime()}`}
                                                className={`object-cover ${isPresent || isLate ? '' : 'grayscale'}`}
                                                alt={displayedName}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `${process.env.PUBLIC_URL}/assets/white_placeholder2.jpg`;
                                                    console.warn(`Failed to load image for ${displayedName}. Using fallback.`);
                                                }}
                                            />
                                        </div>
                                        <div className="pl-3 pr-4 pt-2 pb-4 items-center">
                                            <p
                                                className={`font-[Barlow] text-xs font-poppins font-bold ml-[5px]`}
                                                style={{
                                                    color: isLate
                                                        ? '#b59b00'
                                                        : isPresent
                                                            ? (sectionInfo?.hexcode || '#0097b2')
                                                            : '#737373'
                                                }}
                                            >
                                                {isLate ? 'Late' : isPresent ? 'Present' : 'Absent'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2]">
                                                    {firstName} {middleName && `${middleName.charAt(0)}.`} <br /> {lastName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-12 text-lg font-poppins">
                        No class scheduled for today.
                    </div>
                )}
            </section>

            {/* Request Modal */}
            {showRequestModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowRequestModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md mx-auto"
                        onClick={(e) => e.stopPropagation()}
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
                                <option value="" disabled>Select Student</option>
                                {dropdownStudents.map((student) => (
                                    <option key={student.student_details_id} value={student.student_details_id}>
                                        {student.student_name}
                                    </option>
                                ))}
                            </select>
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
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddDropRequest}
                                className="px-4 py-2 bg-[#0097b2] text-white rounded-md hover:bg-[#007b8e]"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Unlock Attendance Modal */}
            {showUnlockModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowUnlockModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-green-700 mb-4">Unlock Attendance</h2>

                        <div className="mb-4">
                            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-1">
                                Enter Passcode:
                            </label>
                            <input
                                type="password"
                                id="passcode"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-700"
                                value={unlockPasscode}
                                onChange={(e) => setUnlockPasscode(e.target.value)}
                                placeholder="Passcode"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => { setShowUnlockModal(false); setUnlockPasscode(''); }}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnlockAttendance}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Unlock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}