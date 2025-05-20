import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiSettings } from "react-icons/fi";
import '../../App.css';

export default function Classes_Dashboard({ selectedDate }) {

    return (
        <div
            className="bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll"
            style={{ backgroundImage: "url('assets/forest_theme.png')" }}
        >

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

                    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg">
                        <div className="bg-[#0097b2] p-4 flex items-start justify-between rounded-t-xl relative"
                        style={{
                        backgroundImage: "url('assets/classes_vector_2.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 5px bottom ",
                        backgroundSize: "160px"
                        }}>
                            <div className="font-poppins">
                            <p className="text-white text-sm font-semibold">IT 221</p>
                            <h2 className="text-white text-lg font-bold leading-tight">Information <br />Management</h2>
                            <p className="text-white text-sm mt-1">2R12</p>
                            </div>
                            </div>

                        <div className="px-4 pt-4 mb-24">
                            <p className="text-[#737373] text-sm font-bold font-dm-sans">Upcoming Class</p>
                            <p className="text-[#737373] text-base font-dm-sans">T 7:30 AM – 9:00 AM</p>
                        </div>
                    </div>

                    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg">
                        <div className="bg-[#0097b2] p-4 flex items-start justify-between rounded-t-xl relative"
                        style={{
                        backgroundImage: "url('assets/classes_vector_2.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 5px bottom ",
                        backgroundSize: "160px"
                        }}>
                            <div className="font-poppins">
                            <p className="text-white text-sm font-semibold">IT 221</p>
                            <h2 className="text-white text-lg font-bold leading-tight">Information <br />Management</h2>
                            <p className="text-white text-sm mt-1">2R12</p>
                            </div>
                            </div>

                        <div className="px-4 pt-4 mb-24">
                            <p className="text-[#737373] text-sm font-bold font-dm-sans">Upcoming Class</p>
                            <p className="text-[#737373] text-base font-dm-sans">T 7:30 AM – 9:00 AM</p>
                        </div>
                    </div>

                    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg">
                        <div className="bg-[#0097b2] p-4 flex items-start justify-between rounded-t-xl relative"
                        style={{
                        backgroundImage: "url('assets/classes_vector_2.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 5px bottom ",
                        backgroundSize: "160px"
                        }}>
                            <div className="font-poppins">
                            <p className="text-white text-sm font-semibold">IT 221</p>
                            <h2 className="text-white text-lg font-bold leading-tight">Information <br />Management</h2>
                            <p className="text-white text-sm mt-1">2R12</p>
                            </div>
                            </div>

                        <div className="px-4 pt-4 mb-24">
                            <p className="text-[#737373] text-sm font-bold font-dm-sans">Upcoming Class</p>
                            <p className="text-[#737373] text-base font-dm-sans">T 7:30 AM – 9:00 AM</p>
                        </div>
                    </div>

                    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg">
                        <div className="bg-[#0097b2] p-4 flex items-start justify-between rounded-t-xl relative"
                        style={{
                        backgroundImage: "url('assets/classes_vector_2.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 5px bottom ",
                        backgroundSize: "160px"
                        }}>
                            <div className="font-poppins">
                            <p className="text-white text-sm font-semibold">IT 221</p>
                            <h2 className="text-white text-lg font-bold leading-tight">Information <br />Management</h2>
                            <p className="text-white text-sm mt-1">2R12</p>
                            </div>
                            </div>

                        <div className="px-4 pt-4 mb-24">
                            <p className="text-[#737373] text-sm font-bold font-dm-sans">Upcoming Class</p>
                            <p className="text-[#737373] text-base font-dm-sans">T 7:30 AM – 9:00 AM</p>
                        </div>
                    </div>

                    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg">
                        <div className="bg-[#0097b2] p-4 flex items-start justify-between rounded-t-xl relative"
                        style={{
                        backgroundImage: "url('assets/classes_vector_2.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 5px bottom ",
                        backgroundSize: "160px"
                        }}>
                            <div className="font-poppins">
                            <p className="text-white text-sm font-semibold">IT 221</p>
                            <h2 className="text-white text-lg font-bold leading-tight">Information <br />Management</h2>
                            <p className="text-white text-sm mt-1">2R12</p>
                            </div>
                            </div>

                        <div className="px-4 pt-4 mb-24">
                            <p className="text-[#737373] text-sm font-bold font-dm-sans">Upcoming Class</p>
                            <p className="text-[#737373] text-base font-dm-sans">T 7:30 AM – 9:00 AM</p>
                        </div>
                    </div>

                    
                </div>

                
            </section>
        </div>
    );
}

