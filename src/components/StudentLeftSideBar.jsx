import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StudentLeftSidebar = ({ setBgImage }) => { // setBgImage prop is not used here but kept if needed elsewhere
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // studentDetailsId is read directly here, which is fine for UI logic
    // as it doesn't cause a render loop like in App.js trying to pass it as a prop
    const studentDetailsId = localStorage.getItem('studentDetailsId');


    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        // Corrected console.log to use studentDetailsId
        console.log("Student ID from localStorage in StudentLeftSidebar:", studentDetailsId);
        return () => clearTimeout(timer);
    }, [studentDetailsId]); // Added studentDetailsId to dependency array for clarity, though it's a direct read.

    const Classes_Dashboard = () => {
        navigate("/student-classes-dashboard");
    };

    const Student_Dashboard = () => { // Renamed for clarity, though variable name was Teacher_Dashboard
        navigate("/student-dashboard");
    };

    const Add_Excuse_Request_Page = () => { // Renamed for clarity
        navigate("/add-excuse-request");
    };

    // --- START OF FIX ---
    // Corrected path comparisons for student specific routes
    const dashboard_active = location.pathname === '/student-dashboard'; // Corrected path
    const classes_active = location.pathname === '/student-classes-dashboard'; // Simpler check for student classes
    // Note: If you have dynamic student class routes like /student-classes/:id, you'd use startsWith
    // For now, based on your routes, exact match is sufficient.
    const excuse_requests_active = location.pathname === '/add-excuse-request'; // Corrected path
    // --- END OF FIX ---


    return (
        <>
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

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`font-dm-sans fixed md:static top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 w-[30%] md:w-[9%] z-50 md:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                aria-label="Main sidebar"
            >
                <div className="flex justify-center items-center p-4 relative">
                    {loading ? (
                        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                    ) : (
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/ustp_logo.png`}
                            alt="USTP Logo"
                            className="w-20 h-auto"
                        />
                    )}
                    {!loading && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden absolute top-2 right-2 text-[#1F27A6] text-3xl font-bold"
                            aria-label="Close sidebar"
                        >
                            &times;
                        </button>
                    )}
                </div>

                <nav className="flex flex-col items-center gap-6 mt-5 text-sm text-[#737373]">

                    <button
                        type="button"
                        onClick={Student_Dashboard} 
                        className={`group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
                            dashboard_active ? 'text-[#7685fc]' : 'hover:text-[#7685fc]'
                        }`}
                    >
                        {loading ? (
                            <div className="w-8 h-8 mb-1 rounded bg-gray-200 animate-pulse" />
                        ) : (
                            <>
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/dashboard.png`}
                                    alt="Dashboard"
                                    className={`w-8 h-8 mb-1 block ${dashboard_active ? 'hidden' : 'group-hover:hidden'}`}
                                />
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/dashboard-active.png`}
                                    alt="Dashboard Active"
                                    className={`w-8 h-8 mb-1 ${dashboard_active ? 'block' : 'hidden group-hover:block'}`}
                                />
                            </>
                        )}
                        {loading ? (
                            <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
                        ) : (
                            <span className="text-xs">Dashboard</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={Classes_Dashboard}
                        className={`group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
                            classes_active ? 'text-[#7685fc]' : 'hover:text-[#7685fc]'
                        }`}
                    >
                        {loading ? (
                            <div className="w-6 h-8 mb-1 rounded bg-gray-200 animate-pulse" />
                        ) : (
                            <>
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/classes.png`}
                                    alt="Classes"
                                    className={`w-6 h-8 mb-1 block ${classes_active ? 'hidden' : 'group-hover:hidden'}`}
                                />
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/classes-active.png`}
                                    alt="Classes Active"
                                    className={`w-6 h-8 mb-1 ${classes_active ? 'block' : 'hidden group-hover:block'}`}
                                />
                            </>
                        )}
                        {loading ? (
                            <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
                        ) : (
                            <span className="text-xs">Classes</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={Add_Excuse_Request_Page}
                        className={`group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center ${
                            excuse_requests_active ? 'text-[#7685fc]' : 'hover:text-[#7685fc]'
                        }`}
                    >
                        {loading ? (
                            <div className="w-6 h-8 mb-1 rounded bg-gray-200 animate-pulse" />
                        ) : (
                            <>
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/excuse-2.png`}
                                    alt="Requests"
                                    className={`w-6 h-8 mb-1 block ${excuse_requests_active ? 'hidden' : 'group-hover:hidden'}`}
                                />
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/excuse-active-2.png`}
                                    alt="Requests Active"
                                    className={`w-6 h-8 mb-1 ${excuse_requests_active ? 'block' : 'hidden group-hover:block'}`}
                                />
                            </>
                        )}
                        {loading ? (
                            <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
                        ) : (
                            <span className="text-xs">Excuse <br />Requests</span>
                        )}
                    </button>

                </nav>

                <div className="absolute bottom-4 w-full flex justify-center">
                    <div className="relative group">
                        <button
                            type="button"
                            className="group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 w-full text-center text-[#737373] hover:text-[#7685fc]"
                        >
                            {loading ? (
                                <div className="w-8 h-8 mb-1 rounded-full bg-gray-200 animate-pulse" />
                            ) : (
                                <div className="relative w-8 h-8 mb-1">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/palette.png`}
                                        alt="Default Theme Icon"
                                        className="absolute inset-0 w-8 h-8 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                    />
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/palette-active.png`}
                                        alt="Active Theme Icon"
                                        className="absolute inset-0 w-8 h-8 transition-opacity duration-200 opacity-100 group-hover:opacity-0"
                                    />
                                </div>
                            )}
                            {loading ? (
                                <div className="w-12 h-3 rounded bg-gray-200 animate-pulse" />
                            ) : (
                                <span className="text-xs">Wallpapers</span>
                            )}
                        </button>

                        {!loading && (
                            <div className="absolute bottom-full font-dm-sans text-sm left-1 bg-white border rounded-md shadow-md hidden group-hover:block z-50">
                                <button
                                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    onClick={() => setBgImage(`url('${process.env.PUBLIC_URL}/assets/water_theme.png')`)}
                                >
                                    Water
                                </button>
                                <button
                                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    onClick={() => setBgImage(`url('${process.env.PUBLIC_URL}/assets/forest_theme.png')`)}
                                >
                                    Forest
                                </button>
                                <button
                                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    onClick={() => setBgImage(`url('${process.env.PUBLIC_URL}/assets/ustp_theme.png')`)}
                                >
                                    USTP
                                </button>
                                <button
                                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    onClick={() => setBgImage(`url('${process.env.PUBLIC_URL}/assets/white_theme.png')`)}
                                >
                                    Default
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default StudentLeftSidebar;