import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    date_of_birth: '',
    contact_number: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/student_add_api.php', formData)
      .then(() => {
        alert("Student added successfully!");
        navigate('/admin-students');
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to add student.");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#E55182]">Add New Student</h2>

        <label className="block mb-2">
          First Name:
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Middle Name:
          <input
            type="text"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Last Name:
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Date of Birth:
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-4">
          Contact Number:
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-[#E55182] text-white py-2 rounded hover:bg-[#c0406d] transition duration-200"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}
