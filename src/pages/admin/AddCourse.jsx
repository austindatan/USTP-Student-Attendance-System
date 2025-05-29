import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';

export default function AddCourse() {
  const [formData, setFormData] = useState({
    course_code: '', 
    course_name: '',
    description: '',
  });

  const navigate = useNavigate();
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddCourseModal = (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!formData.course_code || !formData.course_name || !formData.description) {
      alert('Please fill in all fields: Course Code, Course Name, and Description.');
      return;
    }
    setIsAddCourseModalOpen(true);
  };

  const handleConfirmAddCourse = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        'http://localhost/USTP-Student-Attendance-System/admin_backend/course_add.php',
        formData 
      );
      alert('Course added successfully!');
      setIsAddCourseModalOpen(false);


      setFormData({
        course_code: '',
        course_name: '',
        description: '',
      });
      navigate('/admin-courses');
    } catch (error) {
      console.error('Error adding course:', error.response?.data || error.message);
      alert(`Failed to add course: ${error.response?.data?.message || 'Please check the console.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAddCourseModal = () => {
    setIsAddCourseModalOpen(false);
  };

  const handleCancel = () => {
    navigate('/admin-courses');
  };

  return (
    <div
      className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll"
      style={{ backgroundImage: "url('/assets/ustp_theme.png')" }}
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
          <h1 className="text-2xl text-blue-700 font-bold">Add New Course</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleOpenAddCourseModal} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Course Code</label>
              <input
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Course Name</label>
              <input
                type="text"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
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
                Add Course
              </button>
            </div>
          </form>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isAddCourseModalOpen}
        onClose={handleCloseAddCourseModal}
        onConfirm={handleConfirmAddCourse}
        title="Confirm Course Addition"
        message={`Are you sure you want to add the course "${formData.course_code}: ${formData.course_name}"?`}
        confirmText="Add Course"
        loading={isLoading}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
}