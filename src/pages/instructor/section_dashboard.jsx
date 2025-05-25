import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiSettings } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function Teacher_Dashboard({ selectedDate }) {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [presentStudents, setPresentStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const instructor = JSON.parse(localStorage.getItem('instructor'));

    useEffect(() => {
        if (!instructor) {
            navigate('/login-instructor');
        }
    }, [instructor, navigate]);

    useEffect(() => {
        if (!instructor?.instructor_id) return;

        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                const dateStr = format(selectedDate || new Date(), 'yyyy-MM-dd');
                const response = await fetch(
                    `http://localhost/USTP-STUDENT-ATTENDANCE-SYSTEM/instructor_backend/get_students.php?date=${dateStr}&instructor_id=${instructor.instructor_id}`
                );
                const data = await response.json();
                setStudents(data);

                const presentIds = data
                    .filter(student => student.status === 'Present')
                    .map(student => student.student_details_id);
                setPresentStudents(presentIds);
                setTimeout(() => setIsLoading(false), 1500);
            } catch (error) {
                console.error("Error fetching students:", error);
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [selectedDate, instructor?.instructor_id]);

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
            const res = await fetch('http://localhost/USTP-STUDENT-ATTENDANCE-SYSTEM/instructor_backend/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData)
            });

            const result = await res.json();
            console.log('Attendance saved:', result);
        } catch (error) {
            console.error('Error saving attendance:', error);
        }
    };

    return (
        <div className="min-h-screen flex hide-scrollbar overflow-scroll">
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12">
                {/* Header */}
                {isLoading ? (
                    <div className="bg-white rounded-lg p-6 text-white font-poppins mb-6 animate-pulse">
                        <div className="flex justify-between items-center">
                            <div className="bg-gray-200 rounded-full w-6 h-6"></div>
                            <div className="bg-gray-200 rounded-full w-6 h-6"></div>
                        </div>
                        <div className="mt-12 space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-200 rounded w-20 h-5"></div>
                                <div className="bg-gray-200 rounded w-28 h-4"></div>
                            </div>
                            <div className="bg-gray-200 rounded w-60 h-6"></div>
                            <div className="bg-gray-200 rounded w-16 h-4"></div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="bg-[#0097b2] rounded-lg p-6 text-white font-poppins mb-6"
                        style={{
                            backgroundImage: "url('assets/classes_vector_2.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 50px center",
                            backgroundSize: "contain"
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <button onClick={() => navigate("/classes-dashboard")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <FiSettings className="text-xl text-white cursor-pointer" />
                        </div>
                        <div className="mt-12">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-semibold">IT 221</h2>
                                <p className="text-sm">T 7:30 AM - 9:00 AM</p>
                            </div>
                            <h1 className="text-2xl font-bold">Information Management</h1>
                            <p className="text-sm">2R12</p>
                        </div>
                    </div>
                )}

                {/* Search */}
                {isLoading ? (
                    <div className="relative w-80 h-10 rounded-lg bg-white animate-pulse mb-4"></div>
                ) : (
                    <div className="relative">
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
                            className="font-poppins block w-80 ps-10 py-2 text-sm text-white rounded-lg bg-[#0097b2] focus:ring-pink-500 focus:border-pink-500 placeholder-white/50"
                            placeholder="Search for students."
                        />
                    </div>
                )}

                {/* Student Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full mt-6 mb-6">
                    {isLoading
                        ? Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded-[20px] animate-pulse" />
                        ))
                        : students.map((student, index) => {
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
                                            src={student.image || 'default_image_url_here'}
                                            className={`w-24 h-24 sm:w-36 sm:h-36 object-cover ${isPresent ? '' : 'grayscale'}`}
                                            alt={name}
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
        </div>
    );
}
