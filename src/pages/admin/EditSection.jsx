import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_id: '',
    section_name: '',
    course_id: '',
    schedule_day: '',
    start_time: '',
    end_time: '',
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load section info
    axios
      .get(`http://localhost/USTP-Student-Attendance-System/admin_backend/get_single_section.php?section_id=${id}`)
      .then((res) => {
        if (res.data.success && res.data.section) {
          setFormData({ ...res.data.section, section_id: id });
        } else {
          alert(res.data.message || 'Failed to load section data.');
          navigate('/admin-sections');
        }
        setLoading(false);
      })
      .catch(() => {
        alert('Error fetching section data.');
        navigate('/admin-sections');
        setLoading(false);
      });

    // Load course options
    axios
      .get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_courses.php')
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.courses);
        } else {
          console.warn("Failed to load courses:", res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost/USTP-Student-Attendance-System/admin_backend/update_section.php', formData)
      .then((res) => {
        if (res.data.success) {
          alert('Section updated successfully!');
          navigate('/admin-sections');
        } else {
          alert(res.data.message || 'Update failed.');
        }
      })
      .catch(() => {
        alert('Server error during update.');
      });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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
          <h1 className="text-2xl text-blue-700 font-bold">Edit Section</h1>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hidden ID */}
            <input type="hidden" name="section_id" value={formData.section_id} />

            {/* Section Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Section Name</label>
              <input
                type="text"
                name="section_name"
                value={formData.section_name}
                onChange={handleChange}
                required
                autoComplete="off"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E55182]"
              />
            </div>

            {/* Course Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Course</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E55182]"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Day */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Day:</label>
            <select
              name="schedule_day"
              value={formData.schedule_day}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a day</option>
              {[
                'Monday & Tuesday',
                'Monday & Wednesday',
                'Monday & Thursday',
                'Monday & Friday',
                'Monday & Saturday',
                'Tuesday & Wednesday',
                'Tuesday & Thursday',
                'Tuesday & Friday',
                'Tuesday & Saturday',
                'Wednesday & Thursday',
                'Wednesday & Friday',
                'Wednesday & Saturday',
                'Thursday & Friday',
                'Thursday & Saturday',
                'Friday & Saturday'
              ].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
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
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E55182]"
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
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E55182]"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin-sections')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Update Section
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditSection;
