import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LeftSidebar = ({ setBgImage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const Classes_Dashboard = () => {
        navigate("/classes-dashboard");
    };

    const Teacher_Dashboard = () => {
        navigate("/teacher-dashboard");
    };

    const dashboard_active = location.pathname === '/teacher-dashboard';
    const classes_active = ['/classes-dashboard', '/section-dashboard/:sectionId'].some(path =>
    location.pathname.startsWith(path)
    );


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

                {/* Navigation */}
                <nav className="flex flex-col items-center gap-6 mt-5 text-sm text-[#737373]">

                    {/* Teacher Dashboard Button */}
                    <button
                        type="button"
                        onClick={Teacher_Dashboard}
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

                    {/* Classes Dashboard Button */}
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
                </nav>

                {/* Theme Dropdown */}
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

export default LeftSidebar;
