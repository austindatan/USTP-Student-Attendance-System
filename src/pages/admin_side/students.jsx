import React from 'react';

export default function Admin_Students() {
    return (
        <div
            className="h-full min-h-screen flex bg-cover bg-center"
            style={{ backgroundImage: "url('assets/white_theme.png')" }}
        >
            <section className="max-w-[2000px] mx-auto pt-12 px-4 sm:px-6 md:px-[60px] lg:px-[100px]">
                <main className="flex-1 px-4 py-6 sm:p-8 text-left text-base sm:text-lg mt-[20px] mb-[20px] bg-white border-2 border-[#E55182] rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-[#E55182] mb-4">Employee List</h1>

                    <div className="relative">
                        <div className="pb-4 bg-white">
                            <table className="w-full table-fixed text-sm text-left text-pink-900">
                                <thead className="text-xs uppercase bg-pink-100 text-pink-700">
                                    <tr>
                                        <th className="w-85 px-4 py-3 truncate">Name</th>
                                        <th className="w-55 px-4 py-3 truncate">Address</th>
                                        <th className="w-52 px-4 py-3 truncate">Job Position</th>
                                        <th className="w-60 px-4 py-3 truncate">Job Description</th>
                                        <th className="w-19 px-4 py-3 truncate">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                                />
                                            </svg>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="bg-white border-b border-pink-200 hover:bg-pink-50">
                                        <td className="px-4 py-4 truncate text-pink-900 flex items-center gap-2">Austin Dilan Datan</td>
                                        <td className="px-4 py-4 truncate">austindatan@gmail.com</td>
                                        <td className="px-4 py-4 truncate">09262103722</td>
                                        <td className="px-4 py-4 truncate">System Analyst</td>
                                        <td className="px-4 py-4 truncate">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                                />
                                            </svg>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
}
