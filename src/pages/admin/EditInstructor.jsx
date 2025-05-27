/**
 * File: EditInstructor.jsx
 * Purpose: This component displays an edit form for a specific instructor,
 * pre-fills the form with data fetched from the backend (via instructor_id),
 * and submits updated data (including optional image) to the PHP backend (edit_profile.php).
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditInstructor() {
  // State to store instructor form data
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

  const { instructor_id } = useParams(); // Get instructor_id from URL
  const navigate = useNavigate(); // Used to programmatically navigate

  // Fetch instructor details from backend when component mounts
  useEffect(() => {
    console.log("Fetching instructor with id:", instructor_id);
    axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/get_instructor_info.php?instructor_id=${instructor_id}`)
      .then(res => {
        const instructor = res.data;
        console.log("Fetched instructor data:", instructor);

        // If valid data is received, populate the form
        if (instructor && instructor.instructor_id) {
          setForm({
            instructor_id: instructor.instructor_id || '',
            email: instructor.email || '',
            password: '', // Blank to avoid pre-filling password
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
            image: null, // Image is not preloaded
          });
        } else {
          alert("Instructor not found or missing ID.");
          navigate("/admin-instructor");
        }
      })
      .catch(err => {
        console.error("Failed to load instructor:", err);
        alert("Failed to load instructor.");
        navigate("/admin-instructor");
      });
  }, [instructor_id, navigate]);

  // Handle input and file changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      // For file input, store the file object
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      // For text/date inputs, update value
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure instructor_id is present before submitting
    if (!form.instructor_id) {
      alert('Instructor ID is missing, cannot submit form.');
      return;
    }

    // Create FormData to support file and text fields
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== '') {
        data.append(key, val);
      }
    });

    // Optional debug logging
    for (const pair of data.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    // Submit form to backend
    axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/edit_profile.php', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        if (res.data.success) {
          alert("Instructor updated successfully!");
          navigate("/admin-instructor"); // Navigate to instructor list
        } else {
          alert("Update failed: " + (res.data.message || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Update failed due to a network or server error.");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      {/* Form for editing instructor */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        encType="multipart/form-data"
      >
        {/* Go back to instructor list */}
        <button
          type="button"
          onClick={() => navigate("/admin-instructor")}
          className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          ← Go Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#3b82f6]">Edit Instructor</h2>

        {/* Hidden instructor_id input (not used in form directly) */}
        <input type="hidden" name="instructor_id" value={form.instructor_id} />

        {/* Input fields */}
        {[
          { name: "email", label: "Email", type: "email", required: true },
          { name: "password", label: "Password (leave blank to keep current)", type: "password" },
          { name: "firstname", label: "First Name", required: true },
          { name: "middlename", label: "Middle Name" },
          { name: "lastname", label: "Last Name", required: true },
          { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
          { name: "contact_number", label: "Contact Number", required: true },
          { name: "street", label: "Street" },
          { name: "city", label: "City" },
          { name: "province", label: "Province" },
          { name: "zipcode", label: "Zipcode" },
          { name: "country", label: "Country" }
        ].map(({ name, label, type = "text", required }) => (
          <label key={name} className="block mb-4">
            {label}:
            <input
              name={name}
              type={type}
              value={form[name] || ''}
              onChange={handleChange}
              required={required}
              className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
            />
          </label>
        ))}

        {/* Image file input */}
        <label className="block mb-6">
          Image (optional):
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full mt-1"
          />
        </label>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-[#3b82f6] text-white py-2 rounded hover:bg-[#2563eb] transition duration-200"
        >
          Update
        </button>
      </form>
    </div>
  );
}
