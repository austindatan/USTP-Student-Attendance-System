import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';

export default function EditCourse() {
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    description: '',
  });

  const { id } = useParams(); 
  const navigate = useNavigate();
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost/ustp-student-attendance/admin_backend/course_get.php?id=${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching course:', error);
        alert('Failed to fetch course data.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenEditCourseModal = (e) => {
    e.preventDefault();
    if (!formData.course_name || !formData.description) {
      alert('Please fill in both the Course Name and Description.');
      return;
    }
    setIsEditCourseModalOpen(true);
  };

  const handleConfirmEditCourse = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost/ustp-student-attendance/admin_backend/course_edit.php', formData);
      alert('Course updated successfully!');
      setIsEditCourseModalOpen(false);
      navigate('/admin-courses');
    } catch (error) {
      console.error('Error updating course:', error);
      alert(`Failed to update course: ${error.response?.data?.message || 'Please check the console.'}`);
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
          <h1 className="text-2xl text-blue-700 font-bold">Edit Course</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleOpenEditCourseModal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isEditCourseModalOpen}
        onClose={handleCloseEditCourseModal}
        onConfirm={handleConfirmEditCourse}
        title="Confirm Edit"
        message={`Are you sure you want to update the course "${formData.course_name}"?`}
        confirmText="Update Course"
        loading={isLoading}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
}
