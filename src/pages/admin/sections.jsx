import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin_Sections() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost/ustp-student-attendance/admin_backend/section_with_details.php')
            .then(res => {
                console.log("Fetched sections data:", res.data);
                if (res.data.success && Array.isArray(res.data.sections)) {
                    setSections(res.data.sections);
                } else {
                    setSections([]);
                    console.warn("Unexpected data format or no sections found:", res.data);
                    setError(res.data.message || 'No sections found or unexpected data format.');
                }
            })
            .catch((err) => {
                console.error("Error fetching sections:", err);
                setError("Failed to fetch sections. Please check your network or server.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDeleteClick = (section) => {
        setSelectedSection(section);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        axios.post('http://localhost/ustp-student-attendance/admin_backend/delete_section.php', {
            _method: 'DELETE',
            section_id: selectedSection.section_id,
        })
            .then((res) => {
                if (res.data.success) {
                    setSections(sections.filter(s => s.section_id !== selectedSection.section_id));
                } else {
                    console.error(res.data.message || "Failed to delete section.");
                }
            })
            .catch((err) => {
                console.error("An error occurred while deleting:", err);
                console.error("An error occurred while deleting.");
            })
            .finally(() => {
                setIsModalOpen(false);
                setSelectedSection(null);
            });
    };

    const handleViewCourses = (sectionId) => {
        navigate(`/sections/${sectionId}/courses`);
    };

    const filteredSections = sections.filter(section =>
        section.section_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex"
            style={{ overflowY: "auto" }}
        >
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
                            <h1 className="text-2xl text-blue-700 font-bold">Section List</h1>
                        )}
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <p className="text-blue-700 font-semibold whitespace-nowrap">
                            Total Sections: {filteredSections.length}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search sections..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
                            />
                            <button
                                onClick={() => navigate("/admin-sections/add")}
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
                            >
                                + Add Section
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading sections...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div
                            className="overflow-x-auto"
                            style={{ WebkitOverflowScrolling: "touch" }}
                        >
                            <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                                <thead className="bg-blue-100 uppercase text-blue-700">
                                    <tr>
                                        <th className="px-4 py-2">Section Name</th>
                                        <th className="px-4 py-2">Year Level</th>
                                        <th className="px-4 py-2">Semester</th>
                                        <th className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSections.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                                No sections found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSections.map((section, index) => (
                                            <tr
                                                key={section.section_id || index}
                                                className="border-b border-blue-200 hover:bg-blue-50"
                                            >
                                                <td className="px-4 py-2 truncate max-w-[140px]">
                                                    {section.section_name}
                                                </td>
                                                <td className="px-4 py-2 truncate max-w-[120px]">
                                                    {section.year_level_name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 truncate max-w-[120px]">
                                                    {section.semester_name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap space-x-2">
                                                    <button
                                                        onClick={() => handleViewCourses(section.section_id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        View Courses
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin-edit-section/${section.section_id}`)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(section)}
                                                        className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Delete
                                                    </button>
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
            {/* Delete Confirmation Modal */}
            {isModalOpen && selectedSection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Delete
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete{" "}
                            <span className="font-bold">{selectedSection.section_name}</span>?
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}