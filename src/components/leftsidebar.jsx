import React, { useState } from "react";

function LeftSidebar() {
    return (
        <aside id="mobile-slide-menu" className="fixed md:fixed top-0 left-0 h-full bg-white text-white transform md:transform-none -translate-x-full md:translate-x-0 transition-transform duration-300 z-40 flex flex-col w-[80px] md:w-[9%] shadow-lg md:z-auto">

            <div className="flex justify-center items-center p-4">
                <img src="assets/ustp_logo.png" className="w-20 h-auto" />
                <button id="close-menu" className="md:hidden text-[#1F27A6] text-3xl font-bold absolute top-2 right-2">&times;</button>
            </div>

            <nav className="flex flex-col items-center gap-6 mt-5 text-sm text-[#1F27A6]">

                <a 
                    href="." 
                    className="group flex flex-col items-center hover:text-[#7685fc] px-3 py-2 rounded-lg transition-all duration-200 w-full text-center
                    {{ request()->routeIs('admin.dashboard') ? 'bg-purple-200 text-[#737373] font-semibold' : 'text-[#1F27A6]' }}">
                    <img src="assets/dashboard.png" className="w-8 h-8 mb-1 block group-hover:hidden" />
                    <img src="assets/dashboard-active.png" className="w-8 h-8 mb-1 hidden group-hover:block" />
                    <span className="text-xs">Dashboard</span>
                </a>

                <a 
                    href="." 
                    className="group flex flex-col items-center hover:text-[#7685fc] px-3 py-2 rounded-lg transition-all duration-200 w-full text-center
                    {{ request()->routeIs('admin.dashboard') ? 'bg-purple-200 text-[#737373] font-semibold' : 'text-[#1F27A6]' }}">
                    <img src="assets/classes.png" className="w-6 h-8 mb-1 block group-hover:hidden" />
                    <img src="assets/classes-active.png" className="w-6 h-8 mb-1 hidden group-hover:block" />
                    <span className="text-xs">Classes</span>
                </a>
            </nav>

        </aside>
    );
}

export default LeftSidebar;
