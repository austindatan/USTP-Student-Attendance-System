import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiSettings } from "react-icons/fi";
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import ClassCard from './components/class_card';

export default function Classes_Dashboard({ selectedDate }) {
    const [presentStudents, setPresentStudents] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const section_dashboard = () => {
        navigate("/section-dashboard");
    };

    useEffect(() => {
        // Simulate loading for 1.5 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (

            <section className="w-full pt-12 px-6 sm:px-6 md:px-12">

                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="font-poppins block w-80 ps-10 py-2 text-sm text-black rounded-lg bg-white focus:ring-pink-500 focus:border-pink-500 placeholder-gray-500"
                        placeholder="Search for classes."
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full mt-6 mb-6">
                
                    <ClassCard 
                        isLoading={isLoading} 
                        onClick={section_dashboard} 
                        code="IT 221" 
                        title="Information Management" 
                        room="2R12" 
                        schedule="T 7:30 AM – 9:00 AM"
                        bgImage="assets/classes_vector_2.png"
                        bgClass="bg-[#0097b2]"
                    />

                    <ClassCard 
                        isLoading={isLoading} 
                        onClick={section_dashboard} 
                        code="IT 221" 
                        title="Web Systems and Technologies" 
                        room="2R12" 
                        schedule="T 7:30 AM – 9:00 AM"
                        bgImage="assets/classes_vector_3.png"
                        bgClass="bg-[#cda49d]"
                    />

                    
                </div>

                
            </section>
    );
}

