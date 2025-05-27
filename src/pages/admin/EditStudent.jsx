import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditStudent() {
  const { student_id } = useParams(); // Corrected: use student_id from route params
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    date_of_birth: '',
    contact_number: ''
  });
  const navigate = useNavigate();

   useEffect(() => {
    // Apply USTP theme background when component mounts
    document.body.style.backgroundImage = "url('assets/ustp_theme.png')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'top center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';

    return () => {
      // Cleanup background on unmount
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.height = '';
      document.body.style.margin = '';
    };
  }, []);


  useEffect(() => {
    axios.get(`http://localhost/ustp-student-attendance-system/admin_backend/student_get_api.php?student_id=${student_id}`)
      .then(res => {
        setFormData(res.data);
      })
      .catch(() => {
        alert("Failed to fetch student data");
        navigate('/admin-students');
      });
  }, [student_id, navigate]); // Correct dependency

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost/ustp-student-attendance-system/admin_backend/student_update_api.php?student_id=${student_id}`, formData)
      .then(() => {
        alert("Student updated successfully!");
        navigate('/admin-students');
      })
      .catch(() => {
        alert("Failed to update student.");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Student</h2>

        <label className="block mb-2">
          First Name:
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-2">
          Middle Name:
          <input
            type="text"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors"
        >
          Update Student
        </button>
      </form>
    </div>
  );
}
