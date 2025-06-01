import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal'; // Import ConfirmationModal

export default function EditInstructor() {
  const [form, setForm] = useState({
    instructor_id: '',
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

  const { instructor_id } = useParams();
  const navigate = useNavigate();
  const [isEditInstructorModalOpen, setIsEditInstructorModalOpen] = useState(false); // State for modal
  const [isLoading, setIsLoading] = useState(false); // State for loading

  useEffect(() => {
    axios
      .get(`http://localhost/USTP-Student-Attendance-System/admin_backend/get_instructor_info.php?instructor_id=${instructor_id}`)
      .then(res => {
        const instructor = res.data;
        if (instructor && instructor.instructor_id) {
          setForm({
            instructor_id: instructor.instructor_id || '',
            email: instructor.email || '',
            password: '', // Password should usually not be pre-filled for security
            firstname: instructor.firstname || '',
            middlename: instructor.middlename || '',
            lastname: instructor.lastname || '',
            date_of_birth: instructor.date_of_birth || '',
            contact_number: instructor.contact_number || '',
            street: instructor.street || '',
            city: instructor.city || '',
            province: instructor.province || '',
            zipcode: instructor.zipcode || '',
            country: instructor.country || '',
            image: null,
          });
        } else {
          alert('Instructor not found or missing ID.');
          navigate('/admin-instructor');
        }
      })
      .catch(() => {
        alert('Failed to load instructor.');
        navigate('/admin-instructor');
      });
  }, [instructor_id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.instructor_id) {
      alert('Instructor ID is missing, cannot submit form.');
      return;
    }

    // Basic validation before opening modal
    if (!form.email || !form.firstname || !form.lastname || !form.date_of_birth || !form.contact_number) {
        alert('Please fill in all required fields: Email, First Name, Last Name, Date of Birth, and Contact Number.');
        return;
    }

    setIsEditInstructorModalOpen(true); // Open confirmation modal
  };

  const handleConfirmEditInstructor = async () => {
    setIsLoading(true);

    const data = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== '') {
        data.append(key, form[key]);
      }
    }

    try {
      const res = await axios.post(
        'http://localhost/USTP-Student-Attendance-System/admin_backend/edit_profile.php',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (res.data.success) {
        // Removed alert here
        setIsEditInstructorModalOpen(false);
        navigate('/admin-instructor');
      } else {
        alert('Update failed: ' + (res.data.message || 'Unknown error'));
        setIsEditInstructorModalOpen(false); // Close modal on failure
      }
    } catch (error) {
      console.error("Update failed due to network or server error:", error);
      alert('Update failed due to a network or server error.');
      setIsEditInstructorModalOpen(false); // Close modal on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEditInstructorModal = () => {
    setIsEditInstructorModalOpen(false);
  };

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
          <h1 className="text-2xl text-blue-700 font-bold">Edit Instructor</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
            <input type="hidden" name="instructor_id" value={form.instructor_id} />

            {[
              ['email', 'Email', 'email', true],
              ['password', 'Password (leave blank to keep current)', 'password', false],
              ['firstname', 'First Name', 'text', true],
              ['middlename', 'Middle Name', 'text', false],
              ['lastname', 'Last Name', 'text', true],
              ['date_of_birth', 'Date of Birth', 'date', true],
              ['contact_number', 'Contact Number', 'text', true],
              ['street', 'Street', 'text', false],
              ['city', 'City', 'text', false],
              ['province', 'Province', 'text', false],
              ['zipcode', 'Zipcode', 'text', false],
              ['country', 'Country', 'text', false],
            ].map(([name, label, type, required]) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name] || ''}
                  onChange={handleChange}
                  required={required}
                  autoComplete="off"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" // Changed focus color to blue-500 for consistency
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700">Image (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
              />
            </div>

            <div className="md:col-span-2 flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin-instructor')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Update Instructor
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isEditInstructorModalOpen}
        onClose={handleCloseEditInstructorModal}
        onConfirm={handleConfirmEditInstructor}
        title="Confirm Edit"
        message={`Are you sure you want to update the instructor "${form.firstname} ${form.lastname}"?`}
        confirmText="Update Instructor"
        loading={isLoading}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
}