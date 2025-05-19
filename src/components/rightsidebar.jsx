import React from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
} from "date-fns";
import { FiSettings } from "react-icons/fi";

const RightSidebar = ({ selectedDate, setSelectedDate }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-semibold text-gray-700">
                {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="gap-4 flex items-center">
                <button
                    className="text-xl text-gray-500 hover:text-[#7685fc]"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                    &lt;
                </button>
                <button
                    className="text-xl text-gray-500 hover:text-[#7685fc]"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                    &gt;
                </button>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const dateFormat = "EE";
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div
                    className="text-[12px] font-medium text-center text-gray-400"
                    key={i}
                >
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-1">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart);
        const endDate = addDays(startDate, 41); // 6 weeks view

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSunday = day.getDay() === 0;

                days.push(
                    <div
                        key={day}
                        className={`text-sm text-center cursor-pointer rounded-full w-8 h-8 flex items-center justify-center mx-auto transition-all duration-150
                        ${isSelected ? "bg-[#7685fc] text-white"
                            : isToday ? "border border-[#7685fc] text-[#7685fc]"
                                : isCurrentMonth ? (isSunday ? "text-red-500" : "text-gray-700")
                                    : "text-gray-300"}`}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        {format(day, "d")}
                    </div>
                );

                day = addDays(day, 1);
            }
            rows.push(<div className="grid grid-cols-7 mb-1" key={day}>{days}</div>);
            days = [];
        }

        return <div>{rows}</div>;
    };

    return (
        <>
{/* Hamburger button */}
{!isSidebarOpen && (
    <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
            onClick={toggleSidebar}
            className="bg-white w-12 h-10 shadow-md border rounded-md hover:shadow-lg transition flex items-center justify-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
            </svg>
        </button>
    </div>
)}

            {/* Sidebar */}
    <aside className={`font-dm-sans fixed top-0 right-0 h-full w-[85%] sm:w-[60%] lg:w-[23%] bg-white shadow-lg flex flex-col p-4 border-l border-gray-200 z-40 transition-transform duration-300 
    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} 
    lg:translate-x-0 lg:relative lg:flex`}>

    {/* X button for mobile */}
    <div className="lg:hidden flex justify-start mb-2">
        <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-blue-500 text-xl font-bold"
        >
            ×
        </button>
    </div>

    <div className="flex items-center justify-between mb-5">
        <FiSettings className="text-xl text-gray-500 cursor-pointer" />
        <div className="flex items-center space-x-3">
            <div className="text-right">
                <div className="font-semibold text-sm text-gray-800">Austin Dilan Datan</div>
                <div className="text-xs text-gray-500">austindatan@gmail.com</div>
            </div>
            <img src="assets/student_files/Luna_Snow_Uniform_III.png" alt="avatar" className="w-10 h-10 rounded-full border" />
        </div>
    </div>

    <div className="text-xs text-gray-500 mb-3">
        {selectedDate ? format(selectedDate, "MMMM d, yyyy - EEEE") : "No date selected"}
    </div>

    <div className="bg-white">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
    </div>
</aside>
        </>
    );
};

export default RightSidebar;
