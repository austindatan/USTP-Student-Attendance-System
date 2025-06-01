import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';
import MessageModal from '../../components/MessageModal'; 

export default function EditCourse() {
    const [formData, setFormData] = useState({
        course_id: '',
        course_code: '',
        course_name: '',
        description: '',
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/course_get.php?id=${id}`)
            .then((response) => {
                if (response.data.success === false) {
                    showMessageModal('Error', response.data.message || 'Failed to fetch course data.', 'error');
                    navigate('/admin-courses');
                    return;
                }
                setFormData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching course:', error);
                showMessageModal('Error', 'Failed to fetch course data. Please check the console for details.', 'error');
                navigate('/admin-courses');
            });
    }, [id, navigate, showMessageModal]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenEditCourseModal = (e) => {
        e.preventDefault();
        if (!formData.course_code || !formData.course_name || !formData.description) {
            showMessageModal('Missing Information', 'Please fill in all fields: Course Code, Course Name, and Description.', 'error');
            return;
        }
        setIsEditCourseModalOpen(true);
    };

    const handleConfirmEditCourse = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/course_edit.php', formData);
            if (response.data.success) {
                setIsEditCourseModalOpen(false);
                showMessageModal('Success!', 'Course updated successfully!', 'success');
                navigate('/admin-courses');
            } else {
                showMessageModal('Update Failed', `Failed to update course: ${response.data.message || 'Unknown error.'}`, 'error');
                setIsEditCourseModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            showMessageModal('Error', `Failed to update course: ${error.response?.data?.message || 'Please check the console.'}`, 'error');
            setIsEditCourseModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseEditCourseModal = () => {
        setIsEditCourseModalOpen(false);
    };

    const handleCancel = () => {
        navigate('/admin-courses');
    };

    return (
        <div
            className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll"
        >
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0 max-w-5xl mx-auto">
                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={{
                        backgroundImage: "url('/assets/classroom_vector.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right',
                        backgroundSize: 'contain',
                    }}
                >
                    <h1 className="text-2xl text-blue-700 font-bold">Edit Course</h1>
                </div>

                <div className="bg-white shadow-md p-8 rounded-lg">
                    <form onSubmit={handleOpenEditCourseModal} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <input type="hidden" name="course_id" value={formData.course_id} />

                        <div className="md:col-span-2">
                            <label htmlFor="course_code" className="block text-sm font-semibold text-gray-700">Course Code</label>
                            <input
                                type="text"
                                id="course_code"
                                name="course_code"
                                value={formData.course_code}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="course_name" className="block text-sm font-semibold text-gray-700">Course Name</label>
                            <input
                                type="text"
                                id="course_name"
                                name="course_name"
                                value={formData.course_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                            >
                                Update Course
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <ConfirmationModal
                isOpen={isEditCourseModalOpen}
                onClose={handleCloseEditCourseModal}
                onConfirm={handleConfirmEditCourse}
                title="Confirm Edit"
                message={`Are you sure you want to update the course "${formData.course_code}: ${formData.course_name}"?`}
                confirmText="Update Course"
                loading={isLoading}
                confirmButtonClass="bg-blue-700 hover:bg-blue-800"
            />

            {/* MessageModal Component */}
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={closeMessageModal}
                title={messageModalTitle}
                message={messageModalMessage}
                type={messageModalType}
            />
        </div>
    );
}
