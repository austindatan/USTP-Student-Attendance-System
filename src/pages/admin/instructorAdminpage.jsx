import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InstructorAdminPage() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const [message, setMessage] = useState("");
    const [isMessageError, setIsMessageError] = useState(false);

    const navigate = useNavigate();

    const fetchInstructors = useCallback(() => {
        setLoading(true);
        axios.get('http://localhost/ustp-student-attendance-system/api/admin_backend/get_instructor_info.php')
            .then((res) => {
                if (!res.data.error) {
                    setInstructors(res.data);
                } else {
                    console.error(res.data.error);
                    setInstructors([]);
                    setMessage(res.data.error || 'Failed to load instructors due to data error.');
                    setIsMessageError(true);
                    setTimeout(() => setMessage(""), 3000); // Auto-hide after 3 seconds
                }
            })
            .catch(() => {
                setError("Failed to fetch instructors.");
                setMessage('Failed to fetch instructors. Please check your network connection or server.');
                setIsMessageError(true);
                setTimeout(() => setMessage(""), 3000); // Auto-hide after 3 seconds
            })
            .finally(() => setLoading(false));
    }, []); 

    useEffect(() => {
        fetchInstructors();
    }, [fetchInstructors]);

    const handleDeleteClick = (instructor) => {
        setSelectedInstructor(instructor);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        axios.post('http://localhost/ustp-student-attendance-system/api/admin_backend/delete_instructor.php', {
            _method: 'DELETE',
            instructor_id: selectedInstructor.instructor_id,
        })
            .then((res) => {
                if (res.data.success) {
                    setInstructors(instructors.filter(i => i.instructor_id !== selectedInstructor.instructor_id));
                    // UPDATED: Use floating message for success
                    setMessage("Instructor deleted successfully!");
                    setIsMessageError(false);
                } else {
                    // UPDATED: Use floating message for deletion failure
                    setMessage(res.data.message || "Failed to delete instructor.");
                    setIsMessageError(true);
                }
            })
            .catch(() => {
                // UPDATED: Use floating message for delete error
                setMessage("An error occurred while deleting the instructor. Please try again.");
                setIsMessageError(true);
            })
            .finally(() => {
                setIsModalOpen(false);
                setSelectedInstructor(null);
                setTimeout(() => { // Auto-hide the message after 3 seconds
                    setMessage("");
                    setIsMessageError(false);
                }, 3000);
            });
    };

    const filteredInstructors = instructors.filter((instructor) => {
        const fullName = `${instructor.firstname} ${instructor.middlename || ''} ${instructor.lastname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex flex-col overflow-y-auto">
            {/* ADDED: Floating message display */}
            {message && (
                <div className={`fixed top-4 right-4 p-3 rounded-md shadow-lg z-50 transition-opacity duration-300 ${isMessageError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {message}
                </div>
            )}

            <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">
                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={
                        !loading
                            ? {
                                  backgroundImage: "url('assets/teacher_vector.png')",
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: "right",
                                  backgroundSize: "contain"
                              }
                            : {}
                    }
                >
                    <div className="leading-none">
                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="w-1/3 h-4 bg-white/50 rounded"></div>
                                <div className="w-1/2 h-8 bg-white/60 rounded"></div>
                            </div>
                        ) : (
                            <h1 className="text-2xl text-blue-700 font-bold">Instructor List</h1>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-md p-6 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <p className="text-blue-700 font-semibold whitespace-nowrap">
                            Total Instructors: {filteredInstructors.length}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search instructors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
                            />
                            <button
                                onClick={() => navigate("/admin-instructor/add")}
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
                            >
                                + Add Instructor
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading instructors...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full text-sm text-left text-blue-900 border-collapse table-fixed w-full">
                                <thead className="bg-blue-100 uppercase text-blue-700">
                                    <tr>
                                        <th className="px-3 py-2 w-[22%]">First Name</th>
                                        <th className="px-3 py-2 w-[22%]">Middle Name</th>
                                        <th className="px-3 py-2 w-[22%]">Last Name</th>
                                        <th className="px-3 py-2 w-[14%]">Date of Birth</th>
                                        <th className="px-3 py-2 w-[20%] text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInstructors.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                No instructors found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInstructors.map((instructor, index) => (
                                            <tr key={instructor.instructor_id || index} className="border-b border-blue-200 hover:bg-blue-50">
                                                <td className="px-3 py-2 truncate min-w-0">{instructor.firstname}</td>
                                                <td className="px-3 py-2 truncate min-w-0">{instructor.middlename}</td>
                                                <td className="px-3 py-2 truncate min-w-0">{instructor.lastname}</td>
                                                <td className="px-3 py-2 truncate min-w-0">{instructor.date_of_birth}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex gap-1 justify-center">
                                                        <button
                                                            onClick={() => navigate(`/admin-instructor/edit/${instructor.instructor_id}`)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(instructor)}
                                                            className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* Delete Confirmation Modal (remains the same) */}
            {isModalOpen && selectedInstructor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Delete
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the instructor {" "}
                            <span className="font-bold">{selectedInstructor.firstname} {selectedInstructor.lastname}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}