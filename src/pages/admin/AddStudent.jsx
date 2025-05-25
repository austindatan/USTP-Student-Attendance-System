import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    date_of_birth: '',
    contact_number: '',
    email: '',
    password: '',
    street: '',
    city: '',
    province: '',
    zipcode: '',
    country: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // Append image file
    if (imageFile) {
      data.append('image', imageFile);
    }

    axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/student_add_api.php', data)
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
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md" encType="multipart/form-data">
        <h2 className="text-2xl font-bold mb-4 text-[#E55182]">Add New Student</h2>

        {[
          { name: "firstname", label: "First Name", required: true },
          { name: "middlename", label: "Middle Name" },
          { name: "lastname", label: "Last Name", required: true },
          { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
          { name: "contact_number", label: "Contact Number", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "password", label: "Password", type: "password", required: true },
          { name: "street", label: "Street" },
          { name: "city", label: "City" },
          { name: "province", label: "Province" },
          { name: "zipcode", label: "Zipcode" },
          { name: "country", label: "Country" }
        ].map(({ name, label, type = "text", required }) => (
          <label key={name} className="block mb-2">
            {label}:
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </label>
        ))}

        <label className="block mb-4">
          Profile Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1"
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
