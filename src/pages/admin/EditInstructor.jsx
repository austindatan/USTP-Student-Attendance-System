import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    axios
      .get(`http://localhost/USTP-Student-Attendance-System/admin_backend/get_instructor_info.php?instructor_id=${instructor_id}`)
      .then(res => {
        const instructor = res.data;
        if (instructor && instructor.instructor_id) {
          setForm({
            instructor_id: instructor.instructor_id || '',
            email: instructor.email || '',
            password: '', // leave blank to keep unchanged
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

    const data = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== '') {
        data.append(key, form[key]);
      }
    }

    axios
      .post('http://localhost/USTP-Student-Attendance-System/admin_backend/edit_profile.php', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        if (res.data.success) {
          alert('Instructor updated successfully!');
          navigate('/admin-instructor');
        } else {
          alert('Update failed: ' + (res.data.message || 'Unknown error'));
        }
      })
      .catch(() => {
        alert('Update failed due to a network or server error.');
      });
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/teacher_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Edit Instructor</h1>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
            {/* Hidden input for instructor_id */}
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
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E55182]"
                />
              </div>
            ))}

            {/* Image upload */}
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

            {/* Submit button */}
            <div className="md:col-span-2 flex justify-end items-center">
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
    </div>
  );
}
