import React, { useState, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';
import MessageModal from '../../components/MessageModal'; 

export default function AddInstructor() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        middlename: '',
        lastname: '',
        date_of_birth: '',
        contact_number: '',
        street: '',
        city: '',
        province: '',
        zipcode: '',
        country: '',
        image: null,
    });

    const navigate = useNavigate();
    const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] = useState(false);
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleResetForm = () => {
        setFormData({
            email: '',
            password: '',
            firstname: '',
            middlename: '',
            lastname: '',
            date_of_birth: '',
            contact_number: '',
            street: '',
            city: '',
            province: '',
            zipcode: '',
            country: '',
            image: null,
        });
        // Clear file input manually if needed (not directly controlled by value prop)
        const fileInput = document.querySelector('input[name="image"]');
        if (fileInput) fileInput.value = '';
    };


    const handleOpenAddInstructorModal = (e) => {
        e.preventDefault();

        if (
            !formData.email ||
            !formData.password ||
            !formData.firstname ||
            !formData.lastname ||
            !formData.date_of_birth
        ) {
            showMessageModal(
                'Missing Information',
                'Please fill in all required fields (Email, Password, First Name, Last Name, Date of Birth).',
                'error'
            );
            return;
        }
        setIsAddInstructorModalOpen(true);
    };

    const handleConfirmAddInstructor = async () => {
        setIsLoading(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                data.append(key, value);
            }
        });

        try {
            await axios.post(
                'http://localhost/ustp-student-attendance/api/admin-backend/AddInstructor.php',
                data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            setIsAddInstructorModalOpen(false);
            handleResetForm();
            showMessageModal('Success!', 'Instructor added successfully!', 'success');
            navigate('/admin-instructor');
        } catch (error) {
            console.error('Error adding instructor:', error.response?.data || error.message);
            showMessageModal(
                'Error Adding Instructor',
                `Failed to add instructor: ${error.response?.data?.message || 'Please check the console.'}`,
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseAddInstructorModal = () => {
        setIsAddInstructorModalOpen(false);
    };

    const handleCancel = () => {
        navigate('/admin-instructor');
    };

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll" style={{ backgroundImage: "url('/assets/ustp_theme.png')" }}>
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0 max-w-5xl mx-auto">

                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={{
                        backgroundImage: "url('/assets/teacher_vector.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right',
                        backgroundSize: 'contain',
                    }}
                >
                    <h1 className="text-2xl text-blue-700 font-bold">Add New Instructor</h1>
                </div>

                <div className="bg-white shadow-md p-8 rounded-lg">
                    <form onSubmit={handleOpenAddInstructorModal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            ['email', 'Email', 'email'],
                            ['password', 'Password', 'password'],
                            ['firstname', 'First Name'],
                            ['middlename', 'Middle Name'],
                            ['lastname', 'Last Name'],
                            ['date_of_birth', 'Date of Birth', 'date'],
                            ['contact_number', 'Contact Number'],
                            ['street', 'Street'],
                            ['city', 'City'],
                            ['province', 'Province'],
                            ['zipcode', 'Zipcode'],
                            ['country', 'Country'],
                        ].map(([name, label, type = 'text']) => (
                            <div key={name}>
                                <label className="block text-sm font-semibold text-gray-700">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name] || ''}
                                    onChange={handleChange}
                                    required={!['middlename', 'contact_number', 'street', 'city', 'province', 'zipcode', 'country'].includes(name)}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
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
                                Add Instructor
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <ConfirmationModal
                isOpen={isAddInstructorModalOpen}
                onClose={handleCloseAddInstructorModal}
                onConfirm={handleConfirmAddInstructor}
                title="Confirm Instructor Addition"
                message={`Are you sure you want to add "${formData.firstname} ${formData.lastname}" as a new instructor?`}
                confirmText="Add Instructor"
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
