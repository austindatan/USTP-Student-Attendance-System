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

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    if (imageFile) {
      data.append('image', imageFile);
    }

    axios.post('http://localhost/ustp-student-attendance/admin_backend/student_add_api.php', data)
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Add New Student</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-200"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}
