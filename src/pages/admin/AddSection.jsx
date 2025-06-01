import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';
import MessageModal from '../../components/MessageModal'; 

const AddSection = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        section_name: '',
        year_level_id: '',
        semester_id: '',
    });

    const [semesters, setSemesters] = useState([]);
    const [yearLevels, setYearLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Message Modal states
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalTitle, setMessageModalTitle] = useState('');
    const [messageModalMessage, setMessageModalMessage] = useState('');
    const [messageModalType, setMessageModalType] = useState('info'); 

    const showMessageModal = useCallback((title, message, type = 'info') => {
        setMessageModalTitle(title);
        setMessageModalMessage(message);
        setMessageModalType(type);
        setIsMessageModalOpen(true);
    }, []);

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessageModalTitle('');
        setMessageModalMessage('');
        setMessageModalType('info');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch semesters data
                const semestersRes = await axios.get('http://localhost/ustp-student-attendance-system/api/admin_backend/get_semesters.php');
                if (semestersRes.data.success) {
                    setSemesters(semestersRes.data.semesters);
                } else {
                    console.warn("Failed to load semesters:", semestersRes.data.message);
                    showMessageModal('Warning', `Failed to load semesters: ${semestersRes.data.message || 'Unknown error.'}`, 'warning');
                }

                // Fetch year levels data
                const yearLevelsRes = await axios.get('http://localhost/ustp-student-attendance-system/api/admin_backend/get_year_levels.php');
                if (yearLevelsRes.data.success) {
                    setYearLevels(yearLevelsRes.data.year_levels);
                } else {
                    console.warn("Failed to load year levels:", yearLevelsRes.data.message);
                    showMessageModal('Warning', `Failed to load year levels: ${yearLevelsRes.data.message || 'Unknown error.'}`, 'warning');
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                showMessageModal('Error', 'Error fetching necessary data. Please try again later.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showMessageModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.section_name || !formData.semester_id || !formData.year_level_id) {
            showMessageModal('Missing Information', 'Please fill in all required fields (Section Name, Semester, Year Level).', 'error');
            return;
        }

        setIsAddSectionModalOpen(true);
    };

    const handleConfirmAdd = async () => {
        setIsSaving(true);
        try {
            const res = await axios.post('http://localhost/ustp-student-attendance-system/api/admin_backend/section_add.php', formData);
            if (res.data.success) {
                setIsAddSectionModalOpen(false);
                showMessageModal('Success!', 'Section added successfully!', 'success');
                navigate('/admin-sections'); 
            } else {
                showMessageModal('Failed to Add Section', res.data.message || 'Failed to add section.', 'error');
                setIsAddSectionModalOpen(false);
            }
        } catch (error) {
            console.error("Server error during section add:", error);
            showMessageModal('Server Error', 'Server error during section add. Please try again.', 'error');
            setIsAddSectionModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseAddSectionModal = () => {
        setIsAddSectionModalOpen(false);
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={{
                        backgroundImage: "url('/assets/teacher_vector.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right',
                        backgroundSize: 'contain',
                    }}
                >
                    <h1 className="text-2xl text-blue-700 font-bold">Add New Section</h1>
                </div>

                <div className="bg-white shadow-md p-8 rounded-lg">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Section Name</label>
                            <input
                                type="text"
                                name="section_name"
                                value={formData.section_name}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Removed Course ID, Schedule Day, Start Time, End Time inputs */}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Semester</label>
                            <select
                                name="semester_id"
                                value={formData.semester_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a Semester</option>
                                {semesters.map((semester) => (
                                    <option key={semester.semester_id} value={String(semester.semester_id)}>
                                        {semester.semester_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Year Level</label>
                            <select
                                name="year_level_id"
                                value={formData.year_level_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a Year Level</option>
                                {yearLevels.map((yearLevel) => (
                                    <option key={yearLevel.year_id} value={String(yearLevel.year_id)}>
                                        {yearLevel.year_level_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 flex justify-end items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin-sections')}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                            >
                                Add Section
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <ConfirmationModal
                isOpen={isAddSectionModalOpen}
                onClose={handleCloseAddSectionModal}
                onConfirm={handleConfirmAdd}
                title="Confirm Section Addition"
                message={`Are you sure you want to add the section "${formData.section_name}"?`}
                confirmText="Add Section"
                loading={isSaving}
                confirmButtonClass="bg-blue-700 hover:bg-blue-800"
            />

            {/* Message Modal Component */}
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={closeMessageModal}
                title={messageModalTitle}
                message={messageModalMessage}
                type={messageModalType}
            />
        </div>
    );
};

export default AddSection;
