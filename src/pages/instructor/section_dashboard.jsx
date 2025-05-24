import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiSettings } from "react-icons/fi";
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import StudentCard from './components/student_card';

export default function Teacher_Dashboard({ selectedDate }) {

    const [presentStudents, setPresentStudents] = useState([]);
    const navigate = useNavigate();

    const teacher_dashboard = () => {
        navigate("/teacher-dashboard");
    };

    const fakeAttendance = {
        '2025-05-20': ['Jean Grey', 'Pearl Pangan', 'Ghost'],
        '2025-05-21': ['Luna Snow'],
        '2025-05-22': ['Invisible Woman', 'Sentry'],
    };

    const students = [
        { name: 'Jean Grey', img: 'assets/student_files/Jean_Grey_Uniform_III.png' },
        { name: 'Pearl Pangan', img: 'assets/student_files/Wave_Uniform_I.png' },
        { name: 'Luna Snow', img: 'assets/student_files/Luna_Snow_Uniform_III.png' },
        { name: 'Susan Storm', img: 'assets/student_files/Invisible_Woman_Uniform_III.png' },
        { name: 'Ava Starr', img: 'assets/student_files/Ghost_Uniform_II.png' },
        { name: 'Robert Reynolds', img: 'assets/student_files/Sentry_Uniform_II.png' },
        { name: 'Carol Danvers', img: 'assets/student_files/Captain_Marvel_Uniform_IIIIII.png' },
        { name: 'Emma Frost', img: 'assets/student_files/Emma_Frost_Uniform_III.png' },
        { name: 'Johnny Storm', img: 'assets/student_files/Human_Torch_Uniform_III.png' },
        { name: 'Wanda Maximoff', img: 'assets/student_files/Scarlet_Witch_Uniform_III.png' },
        { name: 'Yelena Belova', img: 'assets/student_files/Yelena_Belova_Uniform_III.png' },
        { name: 'Nico Minoru', img: 'assets/student_files/Sister_Grimm_Uniform_II.png' },
        { name: 'Stephen Strange', img: 'assets/student_files/Doctor_Strange_Uniform_IIIII.png' },
        { name: 'Kamala Khan', img: 'assets/student_files/Ms._Marvel__28Kamala_Khan_29_Uniform_IIII.png' },
    ];

    useEffect(() => {
        const dateKey = format(selectedDate || new Date(), 'yyyy-MM-dd');
        setPresentStudents(fakeAttendance[dateKey] || []);
    }, [selectedDate]);

    const toggleAttendance = (studentName) => {
        setPresentStudents(prev =>
            prev.includes(studentName)
                ? prev.filter(name => name !== studentName)
                : [...prev, studentName]
        );
    };

    return (
        <div className="min-h-screen flex hide-scrollbar overflow-scroll">
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12">
                {/* Header */}
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
                        <button type="button" onClick={teacher_dashboard}>
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

                {/* Search */}
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

                {/* Student Cards */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full mt-6 mb-6">
                    {students.map((student, index) => (
                        <StudentCard
                            key={index}
                            student={student}
                            isPresent={presentStudents.includes(student.name)}
                            onToggle={toggleAttendance}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}