import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddSection() {
  const [formData, setFormData] = useState({
    section_name: '',
    course_name: '',
    schedule_day: '',
    start_time: '',
    end_time: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage = "url('assets/ustp_theme.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/section_add_api.php', formData)
      .then(() => {
        alert('Section added successfully!');
        navigate('/admin-sections');
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add section.');
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Add New Section</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Name:</label>
            <input
              type="text"
              name="section_name"
              value={formData.section_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name:</label>
            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Schedule Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Day:</label>
            <select
              name="schedule_day"
              value={formData.schedule_day}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time:</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time:</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-200"
        >
          Add Section
        </button>
      </form>
    </div>
  );
}
