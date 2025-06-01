import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaPalette, FaImage } from "react-icons/fa6";
import { createPortal } from 'react-dom';

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

    const [showImageSelectModal, setShowImageSelectModal] = useState(false);
    const [selectedVectorImage, setSelectedVectorImage] = useState(sectionInfo?.image || 'classes_vector_2.png');

    const imageModalRef = useRef(null);

    const availableVectorImages = [
        'classes_vector_2.png',
        'classes_vector_3.png',
        'classes_vector_7.png',
        'classes_vector_5.png',
        'classes_vector_6.png',
        'classes_vector_8.png',
    ];
    const [lateStudents, setLateStudents] = useState([]);
    const [excusedStudents, setExcusedStudents] = useState([]);
    const [isAttendanceLocked, setIsAttendanceLocked] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockPasscode, setUnlockPasscode] = useState('');

    const [isSearching, setIsSearching] = useState(false);
    const [showLockConfirmModal, setShowLockConfirmModal] = useState(false);
    const [showUnlockSuccessModal, setShowUnlockSuccessModal] = useState(false);
    const [showLockSuccessModal, setShowLockSuccessModal] = useState(false);
    const [showValidationErrorModal, setShowValidationErrorModal] = useState(false);
    const [validationErrorMessage, setValidationErrorMessage] = useState('');

    // NEW: State for "Add Drop Request" success modal
    const [showAddDropSuccessModal, setShowAddDropSuccessModal] = useState(false);

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

            const dummyDate = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes), parseInt(seconds));

            const options = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };

            return dummyDate.toLocaleTimeString('en-US', options);
        } catch (error) {
            console.error("Error formatting time string:", timeString24hr, error);
            return timeString24hr;
        }
    };

    // Helper to get day name from selectedDate
    const getDayName = (date) => {
        console.log("DEBUG: getDayName - selectedDate (inside helper):", date);
        const dayName = format(date || new Date(), 'EEEE');
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

    const handleSaveImage = async () => {
        if (!sectionInfo?.section_course_id) {
            alert("Section information is missing. Cannot update image.");
            return;
        }
        if (!selectedVectorImage) {
            alert("Please select an image.");
            return;
        }

        try {
            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/update_section_image.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section_course_id: sectionInfo.section_course_id,
                    image_path: selectedVectorImage,
                }),
            });
            const data = await response.json();

            if (data.success) {
                setSectionInfo(prevInfo => ({
                    ...prevInfo,
                    image: selectedVectorImage
                }));
                setShowImageSelectModal(false);
            } else {
                alert("Image update failed: " + data.message);
            }
        } catch (error) {
            console.error("Error updating image:", error);
            alert("An error occurred during image update.");
        }
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
                    const response = await fetch(`http://localhost/ustp-student-attendance-system/api/instructor_backend/get_section_info.php?section_id=${sectionId}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
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
        if (!sectionInfo || !sectionInfo.section_id || !sectionInfo.course_id || !selectedDate) {
            console.log("DEBUG (fetchLockStatus): Prerequisites not met. isAttendanceLocked set to false. sectionInfo:", sectionInfo);
            setIsAttendanceLocked(false);
            return;
        }

        const fetchLockStatus = async () => {
            try {
                const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/get_attendance_lock_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        section_id: sectionInfo.section_id,
                        course_id: sectionInfo.course_id,
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
    }, [sectionInfo, selectedDate]);

    useEffect(() => {
        console.log("DEBUG (fetchStudents useEffect): Running. selectedDate:", selectedDate, "instructor:", instructor, "sectionId:", sectionId);
        if (!instructor?.instructor_id || !sectionId || !sectionInfo?.course_id) {
            console.log("DEBUG (fetchStudents): Prerequisites not met for fetching students. sectionInfo:", sectionInfo);
            setIsLoading(false);
            return;
        }

        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                const dateStr = format(selectedDate || new Date(), 'yyyy-MM-dd');
                const courseId = sectionInfo.course_id;
                console.log("DEBUG (fetchStudents): Fetching students for date:", dateStr, "course_id:", courseId);
                const response = await fetch(
                    `http://localhost/ustp-student-attendance-system/api/instructor_backend/get_students.php?date=${dateStr}&instructor_id=${instructor.instructor_id}&section_id=${sectionId}&course_id=${courseId}&_t=${new Date().getTime()}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const sortedData = [...data].sort((a, b) => {
                        const lastNameComparison = a.lastname.localeCompare(b.lastname);
                        if (lastNameComparison !== 0) {
                            return lastNameComparison;
                        }
                        return a.firstname.localeCompare(b.firstname);
                    });
                    setStudents(sortedData);
                    console.log("DEBUG (fetchStudents): Students fetched and sorted:", sortedData);

                    const presentIds = sortedData.filter(student => student.status === 'Present').map(s => s.student_details_id);
                    setPresentStudents(presentIds);
                    const lateIds = sortedData.filter(student => student.status === 'Late').map(s => s.student_details_id);
                    setLateStudents(lateIds);
                    const excusedIds = sortedData.filter(student => student.status === 'Excused').map(s => s.student_details_id);
                    setExcusedStudents(excusedIds);
                } else {
                    console.error("DEBUG (fetchStudents): Backend did NOT return an array for students:", data);
                    setStudents([]);
                    alert("Error: Student data could not be loaded correctly. Please check the backend response.");
                }
                setTimeout(() => setIsLoading(false), 1500);
            } catch (error) {
                console.error("Error fetching students:", error);
                setStudents([]);
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [selectedDate, instructor?.instructor_id, sectionId, sectionInfo]);

    const toggleAttendance = async (student) => {
        console.log("DEBUG: toggleAttendance function called for student:", student.student_details_id);

        if (isAttendanceLocked) {
            alert("Attendance for this session is locked and cannot be modified.");
            return;
        }

        if (!sectionInfo || !sectionInfo.section_id || !sectionInfo.course_id || !selectedDate) {
            console.error("DEBUG (toggleAttendance): Missing section info or date. sectionInfo:", sectionInfo, "selectedDate:", selectedDate);
            alert("Error: Missing section or date information. Cannot save attendance.");
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
            course_id: sectionInfo.course_id,
            date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
            status: newStatus,
        };

        console.log("DEBUG (toggleAttendance): sectionInfo object:", sectionInfo);
        console.log("DEBUG (toggleAttendance): sectionInfo.section_id value:", sectionInfo?.section_id);
        console.log("DEBUG (toggleAttendance): sectionInfo.course_id value:", sectionInfo?.course_id);
        console.log("DEBUG (toggleAttendance): Final attendanceData payload:", attendanceData);

        try {
            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }

            const result = await response.json();
            console.log('Attendance saved:', result);
            if (!result.success) {
                alert("Failed to save attendance: " + result.message);
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Error saving attendance: ' + error.message);
        }
    };

    const filteredStudents = students.filter(student => {
        const middleInitial = student.middlename && student.middlename !== '-' ? student.middlename.charAt(0) + '.' : '';
        const fullNameForSearch = `${student.lastname}, ${student.firstname} ${middleInitial}`.trim();
        return fullNameForSearch.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setIsSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);


    useEffect(() => {
        const fetchDropdownStudents = async () => {
            try {
                if (!instructor?.instructor_id || !sectionId || !sectionInfo?.course_id) {
                    console.log("DEBUG (fetchDropdownStudents): Prerequisites not met.");
                    return;
                }
                const courseId = sectionInfo.course_id;

                const response = await fetch(`http://localhost/ustp-student-attendance-system/api/instructor_backend/student_dropdown.php?instructor_id=${instructor.instructor_id}&section_id=${sectionId}&course_id=${courseId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const sortedDropdownData = [...data].sort((a, b) => {
                    const nameA = a.student_name.split(', ')[0];
                    const nameB = b.student_name.split(', ')[0];
                    return nameA.localeCompare(nameB);
                });
                setDropdownStudents(sortedDropdownData);
            } catch (error) {
                console.error("Error fetching dropdown students:", error);
            }
        };

        fetchDropdownStudents();
    }, [instructor?.instructor_id, sectionId, sectionInfo?.course_id]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (colorModalRef.current && !colorModalRef.current.contains(event.target) &&
                settingsButtonRef.current && !settingsButtonRef.current.contains(event.target)) {
                setShowColorModal(false);
            }
            if (imageModalRef.current && !imageModalRef.current.contains(event.target) &&
                event.target !== document.querySelector('.FaImage')) {
                setShowImageSelectModal(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [colorModalRef, settingsButtonRef, imageModalRef]);


    const markAsLate = async (student) => {
        if (isAttendanceLocked) {
            alert("Attendance for this session is locked and cannot be modified.");
            return;
        }

        if (!sectionInfo || !sectionInfo.section_id || !sectionInfo.course_id || !selectedDate) {
            console.error("DEBUG (markAsLate): Missing section info or date. sectionInfo:", sectionInfo, "selectedDate:", selectedDate);
            alert("Error: Missing section or date information. Cannot save attendance.");
            return;
        }

        const attendanceData = {
            student_details_id: student.student_details_id,
            section_id: sectionInfo.section_id,
            course_id: sectionInfo.course_id,
            date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
            status: 'Late',
        };

        console.log("DEBUG (markAsLate): sectionInfo object:", sectionInfo);
        console.log("DEBUG (markAsLate): sectionInfo.section_id value:", sectionInfo?.section_id);
        console.log("DEBUG (markAsLate): sectionInfo.course_id value:", sectionInfo?.course_id);
        console.log("DEBUG (markAsLate): Final attendanceData payload (Late):", attendanceData);

        try {
            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }

            const result = await response.json();
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
            setValidationErrorMessage("Please select a student and enter a reason.");
            setShowValidationErrorModal(true);
            return; // Stop here, do not proceed with API call
        }

        const requestData = {
            student_details_id: selectedStudentForRequest,
            reason: requestReason,
        };

        try {
            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/add_drop_request.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setShowRequestModal(false);
                setSelectedStudentForRequest('');
                setRequestReason('');
                setShowAddDropSuccessModal(true); // Show the new success modal
            } else {
                setValidationErrorMessage("Failed to submit: " + (result.error || "Unknown error"));
                setShowValidationErrorModal(true);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setValidationErrorMessage("An error occurred while submitting the drop request.");
            setShowValidationErrorModal(true);
        }
    };


    // Function to handle unlocking attendance
    const handleUnlockAttendance = async () => {
        if (!unlockPasscode.trim()) {
            alert("Please enter the passcode.");
            return;
        }

        try {
            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/unlock_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section_id: sectionInfo.section_id,
                    course_id: sectionInfo.course_id,
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    passcode: unlockPasscode,
                    instructor_id: instructor.instructor_id,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setShowUnlockSuccessModal(true); // Show the success modal instead of alert
                setIsAttendanceLocked(false);
                setShowUnlockModal(false);
                setUnlockPasscode('');
            } else {
                alert("Failed to unlock attendance: " + (data.message || "Invalid passcode."));
            }
        } catch (error) {
            console.error("Error unlocking attendance:", error);
            alert("An error occurred while trying to unlock attendance.");
        }
    };

    // Function to handle locking attendance after confirmation
    const handleLockAttendanceConfirm = async () => {
        setShowLockConfirmModal(false); // Close the confirmation modal immediately

        try {
            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/lock_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section_id: sectionInfo.section_id,
                    course_id: sectionInfo.course_id,
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    lock_status: 1,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setShowLockSuccessModal(true); // Show the success modal instead of alert
                setIsAttendanceLocked(true);
            } else {
                alert("Failed to lock attendance: " + data.message);
            }
        } catch (error) {
            console.error("Error locking attendance:", error);
            alert("An error occurred while trying to lock attendance.");
        }
    };

    const [showNoClassContent, setShowNoClassContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNoClassContent(true), 1500);
        return () => clearTimeout(timer);
    }, []);


    console.log("DEBUG (Render): filteredStudents:", filteredStudents);

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
                                <div className="flex gap-2">
                                    <FaPalette
                                        ref={settingsButtonRef}
                                        className="text-xl cursor-pointer shadow-"
                                        onClick={() => {
                                            setShowColorModal(prev => !prev);
                                            setShowImageSelectModal(false);
                                        }}
                                    />

                                    <FaImage
                                        className="text-xl cursor-pointer"
                                        onClick={() => {
                                            setShowImageSelectModal(prev => !prev);
                                            setShowColorModal(false);
                                        }}
                                    />

                                    {showColorModal && (
                                        <div ref={colorModalRef} className="absolute right-0 mt-2 w-79 bg-white p-4 rounded-lg shadow-xl z-50 text-center border border-gray-200">

                                            <h2 className="text-xl font-bold text-sm mb-2" style={{ color: sectionInfo?.hexcode }}>Change Color</h2>
                                            <input
                                                type="color"
                                                value={selectedColor}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                className="w-24 h-12 mb-2"
                                            />
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const response = await fetch('http://localhost/ustp-student-attendance-system/api/instructor_backend/update_section_color.php', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    section_course_id: sectionInfo?.section_course_id,
                                                                    hexcode: selectedColor
                                                                }),
                                                            });

                                                            const result = await response.json();
                                                            if (result.success) {
                                                                setSectionInfo(prev => ({ ...prev, hexcode: selectedColor }));
                                                                setShowColorModal(false);
                                                            } else {
                                                                alert('Update failed: ' + (result.error || 'Unknown error'));
                                                            }
                                                        } catch (err) {
                                                            console.error('Failed to update color:', err);
                                                            alert('Error updating color.');
                                                        }
                                                    }}
                                                    className="bg-blue-500 text-white text-xs px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setShowColorModal(false)}
                                                    className="bg-gray-300 px-4 py-2 text-xs rounded hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* IMAGE UPLOAD MODAL */}
                                {showImageSelectModal && (
                                    <div
                                        className="absolute right-0 mt-2 w-72 bg-white p-4 rounded-lg shadow-xl z-50 text-center border border-gray-200"
                                        ref={imageModalRef}
                                    >
                                        <h2 className="text-xl font-bold mb-4" style={{ color: sectionInfo?.hexcode }}>Select Section Image</h2>

                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {availableVectorImages.map((imagePath, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-1 border rounded-md cursor-pointer ${selectedVectorImage === imagePath ? 'border-2 border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                                                    onClick={() => setSelectedVectorImage(imagePath)}
                                                >
                                                    <img
                                                        src={`http://localhost/ustp-student-attendance-system/public/assets/${imagePath}`}
                                                        alt={`Vector ${index + 1}`}
                                                        className="w-full h-auto object-contain"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => setShowImageSelectModal(false)}
                                                className="bg-gray-300 px-4 py-2 text-xs rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveImage}
                                                className="bg-blue-500 text-white text-xs px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Save Image
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
                        <div className="flex gap-2 items-end">

                            {isClassDay() && (
                                <div className="flex justify-end gap-2">
                                    {!isAttendanceLocked ? (
                                        <button
                                            onClick={() => setShowLockConfirmModal(true)} // Open confirmation modal
                                            className="px-4 py-2 h-10 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowUnlockModal(true)}
                                            className="px-4 py-2 h-10 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="font-poppins px-4 py-2 text-sm rounded-lg border-2 bg-white text-[#0097b2] hover:bg-[#e4eae9] hover:border-[#007b8e] hover:text-[#007b8e] focus:outline-none focus:ring-2 focus:ring-2 focus:ring-offset-2 focus:ring-[#0097b2] h-10"
                                style={{ borderColor: sectionInfo?.hexcode || '#0097b2', color: sectionInfo?.hexcode || '#0097b2' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

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
                                const isExcused = excusedStudents.includes(student.student_details_id);

                                const firstName = student.firstname || '';
                                const middleInitial = student.middlename && student.middlename !== '-'
                                    ? student.middlename
                                    : '';
                                const lastName = student.lastname && student.lastname !== '-'
                                    ? student.lastname
                                    : '';

                                const fullName = `${firstName} ${middleInitial ? middleInitial + ' ' : ''}${lastName}`;
                                const isLongName = fullName.length > 5;

                                return (
                                    <div
                                        key={student.student_details_id}
                                        onClick={isAttendanceLocked || isExcused ? null : () => toggleAttendance(student)}
                                        onDoubleClick={isAttendanceLocked || isExcused ? null : () => markAsLate(student)}
                                        className={`cursor-pointer transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]
                                            border-2 rounded-[20px] flex flex-col justify-between
                                            ${isExcused
                                                ? 'border-blue-500 bg-blue-100 opacity-100 cursor-not-allowed pointer-events-none'
                                                : isLate
                                                    ? 'cursor-pointer border-yellow-400 bg-yellow-100 opacity-100 hover:shadow-md hover:scale-[1.02]'
                                                    : isPresent
                                                        ? 'cursor-pointer border-[#e4eae9] bg-white opacity-100 hover:shadow-md hover:scale-[1.02]'
                                                        : 'cursor-pointer border-[#e4eae9] bg-white opacity-60 hover:shadow-md hover:scale-[1.02]'
                                            }
                                            ${isAttendanceLocked && !isExcused ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                                            ${isSearching ? 'student-card-exit' : 'student-card-enter'}
                                        `}
                                    >
                                        {isAttendanceLocked && (
                                            <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full z-10">LOCKED</div>
                                        )}
                                        <div className="overflow-hidden rounded-t-[20px] flex justify-center aspect-w-1 aspect-h-1 w-full">
                                            <img
                                                src={`http://localhost/ustp-student-attendance-system/uploads/${student.image}?${new Date().getTime()}`}
                                                className={`object-cover ${isPresent || isLate ? '' : 'grayscale'}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `${process.env.PUBLIC_URL}/assets/white_placeholder2.jpg`;
                                                }}
                                            />
                                        </div>
                                        <div className="pl-3 pr-4 pt-2 pb-4 items-center">
                                            <p
                                                className={`font-[Barlow] text-xs font-poppins font-bold ml-[5px]`}
                                                style={{
                                                    color: isExcused
                                                        ? '#2563eb'
                                                        : isLate
                                                            ? '#b59b00'
                                                            : isPresent
                                                                ? (sectionInfo?.hexcode || '#0097b2')
                                                                : '#737373'
                                                }}
                                            >
                                                {isExcused ? 'Excused' : isLate ? 'Late' : isPresent ? 'Present' : 'Absent'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2]">
                                                    {isLongName ? (
                                                        <>
                                                            {firstName} <br />
                                                            {middleInitial && middleInitial + ' '}
                                                            {lastName}
                                                        </>
                                                    ) : (
                                                        `${firstName} ${middleInitial ? middleInitial + ' ' : ''}${lastName}`
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
                        {!showNoClassContent ? (
                            <div className="w-full h-[400px] rounded-lg bg-gradient-to-r from-white via-gray-200 to-white animate-pulse" />
                        ) : (
                            <>
                                <div className="w-48 h-48 mb-6 animate-fade-in">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/no_schedule_illustration.png`}
                                        alt="No Class"
                                        className="w-full h-full object-contain opacity-80"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-600 font-poppins animate-fade-in">
                                    No class schedule today
                                </h2>
                                <p className="text-sm text-gray-500 mt-1 font-[Barlow] animate-fade-in">
                                    Please check your schedule or contact our administrator.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </section>

            {/* Request Modal */}
            {showRequestModal && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowRequestModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4" style={{ color: sectionInfo?.hexcode }}>Add Drop Request</h2>

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
                                className="px-4 py-2 text-white rounded-md hover:bg-[#007b8e]"
                                style={{ backgroundColor: sectionInfo?.hexcode }}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Unlock Attendance Modal */}
            {showUnlockModal && createPortal(
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
                </div>,
                document.body
            )}

            {/* Lock Confirmation Modal */}
            {showLockConfirmModal && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowLockConfirmModal(false)}
                >
                    <div
                        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-red-700 text-center">Confirm Lock Attendance</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            Are you sure you want to <strong>lock</strong> attendance for this section and date? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setShowLockConfirmModal(false)}
                                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLockAttendanceConfirm}
                                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Lock Attendance
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Unlock Success Modal */}
            {showUnlockSuccessModal && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowUnlockSuccessModal(false)}
                >
                    <div
                        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">Success!</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            Attendance unlocked successfully!
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setShowUnlockSuccessModal(false)}
                                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Lock Success Modal */}
            {showLockSuccessModal && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowLockSuccessModal(false)}
                >
                    <div
                        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">Success!</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            Attendance locked successfully!
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setShowLockSuccessModal(false)}
                                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Validation Error Modal for Add Drop Request */}
            {showValidationErrorModal && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowValidationErrorModal(false)}
                >
                    <div
                        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 text-center">Input Error</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            {validationErrorMessage}
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setShowValidationErrorModal(false)}
                                 className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* NEW: Add Drop Request Success Modal */}
            {showAddDropSuccessModal && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
                    onClick={() => setShowAddDropSuccessModal(false)} // Close on overlay click
                >
                    <div
                        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">Request Sent!</h2>
                        </div>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                            Your drop request has been submitted successfully.
                        </p>
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setShowAddDropSuccessModal(false)}
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
}