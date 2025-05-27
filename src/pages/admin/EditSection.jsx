import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddSection() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_name: '',
    course_id: '',
    schedule_day: '',
    start_time: '',
    end_time: '',
  });

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost/ustp-student-attendance/admin_backend/get_course.php')
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.courses);
          setErrorCourses(null);
        } else {
          setErrorCourses('Failed to fetch courses');
        }
        setLoadingCourses(false);
      })
      .catch((err) => {
        console.error('Axios error:', err);
        setErrorCourses('Error loading courses');
        setLoadingCourses(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure course_id is integer
    const submitData = { ...formData, course_id: parseInt(formData.course_id, 10) };

    axios
      .post(
        'http://localhost/ustp-student-attendance/admin_backend/section_add.php',
        JSON.stringify(submitData),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message || 'Section added successfully!');
          navigate('/admin-sections');
        } else {
          alert(res.data.message || 'Failed to add section.');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('An error occurred while adding the section.');
      });
  };

  const handleCancel = () => {
    navigate('/admin-sections');
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll" style={{ backgroundImage: "url('assets/section_bg.png')" }}>
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0 max-w-5xl mx-auto">

        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/section_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Edit Section</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Section Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Section Name</label>
              <input
                type="text"
                name="section_name"
                value={formData.section_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Course Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Course</label>
              {loadingCourses ? (
                <p className="text-gray-500 mt-2">Loading courses...</p>
              ) : errorCourses ? (
                <p className="text-red-500 mt-2">{errorCourses}</p>
              ) : (
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_code}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Schedule Day */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Schedule Day</label>
              <select
                name="schedule_day"
                value={formData.schedule_day}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-semibold text-gray-700">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">End Time</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Buttons - full width below */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                Edit Section
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}
