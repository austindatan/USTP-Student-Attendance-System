import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });

      await axios.post(
        'http://localhost/USTP-Student-Attendance-System/admin_backend/add_instructor.php',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      alert('Instructor added successfully!');
      navigate('/admin-instructor');
    } catch (error) {
      console.error('Error adding instructor:', error.response || error.message);
      alert('Failed to add instructor.');
    }
  };

  const handleCancel = () => {
    navigate('/admin-instructor');
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0 max-w-5xl mx-auto">

        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/teacher_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Add New Instructor</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['email', 'Email'],
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
                  required={name !== 'middlename' && name !== 'contact_number' && name !== 'street' && name !== 'city' && name !== 'province' && name !== 'zipcode' && name !== 'country'}
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
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
    </div>
  );
}
