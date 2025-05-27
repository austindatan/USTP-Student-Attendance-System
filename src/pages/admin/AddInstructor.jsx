/**
 * File: AddInstructor.jsx
 * Purpose: This component provides a form to add a new instructor.
 * It captures the instructor's information and sends it to the backend PHP API (`add_instructor.php`).
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddInstructor() {
  // Local state to store all form fields
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
    image: null // This will hold the uploaded file object
  });

  const navigate = useNavigate(); // Hook to navigate between routes

  // Handles changes to input fields and file uploads
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      // If uploading an image, store the file object
      setFormData({ ...formData, image: files[0] });
    } else {
      // For all other inputs, update corresponding value
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Use FormData to handle both text fields and the image file
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    // Submit form data to PHP backend
    axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/add_instructor.php', data)
      .then((res) => {
        alert("Instructor added successfully!");
        navigate('/admin-instructor'); // Redirect to instructor list page
      })
      .catch((err) => {
        console.error("Error adding instructor:", err);
        alert("Failed to add instructor.");
      });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Navigation button to return to instructor list */}
      <button
        onClick={() => navigate("/admin-instructor")}
        className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        ← Go Back
      </button>

      {/* Header */}
      <h1 className="text-2xl font-bold text-[#E55182] mb-6">Add New Instructor</h1>

      {/* Form for adding instructor */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Generate inputs for all fields except image */}
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
        ))}

        {/* Input for uploading image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        {/* Submit button spans full width on medium screens */}
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="bg-[#E55182] text-white px-6 py-2 rounded hover:bg-[#c0406d]"
          >
            Save Instructor
          </button>
        </div>
      </form>
    </div>
  );
}
