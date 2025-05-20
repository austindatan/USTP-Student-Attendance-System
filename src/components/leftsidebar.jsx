import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleBack = () => {
        navigate("/classes-dashboard");
    };

    return (
        <>
            {/* Hamburger Button for Mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
                aria-label="Open sidebar"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#1F27A6]"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`font-dm-sans fixed md:static top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300
                    w-[30%] md:w-[9%] z-50 md:z-auto
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                aria-label="Main sidebar"
            >
                {/* Sidebar Header */}
                <div className="flex justify-center items-center p-4 relative">
                    <img
                        src="assets/ustp_logo.png"
                        alt="USTP Logo"
                        className="w-20 h-auto"
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden absolute top-2 right-2 text-[#1F27A6] text-3xl font-bold"
                        aria-label="Close sidebar"
                    >
                        &times;
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col items-center gap-6 mt-5 text-sm text-[#737373]">
                    <button
                        type="button" 
                        className="group flex flex-col items-center hover:text-[#7685fc] px-3 py-2 rounded-lg transition-all duration-200 w-full text-center"
                    >
                        <img
                            src="assets/dashboard.png"
                            alt="Dashboard"
                            className="w-8 h-8 mb-1 block group-hover:hidden"
                        />
                        <img
                            src="assets/dashboard-active.png"
                            alt="Dashboard Active"
                            className="w-8 h-8 mb-1 hidden group-hover:block"
                        />
                        <span className="text-xs">Dashboard</span>
                    </button>

                    <button
                        type="button" 
                        onClick={handleBack} 
                        className="group flex flex-col items-center hover:text-[#7685fc] px-3 py-2 rounded-lg transition-all duration-200 w-full text-center"
                    >
                        <img
                            src="assets/classes.png"
                            alt="Classes"
                            className="w-6 h-8 mb-1 block group-hover:hidden"
                        />
                        <img
                            src="assets/classes-active.png"
                            alt="Classes Active"
                            className="w-6 h-8 mb-1 hidden group-hover:block"
                        />
                        <span className="text-xs">Classes</span>
                    </button>
                </nav>
            </aside>
        </>
    );
};

export default LeftSidebar;
