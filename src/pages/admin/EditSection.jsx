import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSection = () => {
  const { id } = useParams(); // 'id' from the URL parameter like /admin-edit-section/:id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_id: '', // Ensure section_id is part of formData to be sent on update
    section_name: '',
    course_id: '',
    schedule_day: '',
    start_time: '',
    end_time: '',
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set background styles (Consider moving this to a higher-level component or global CSS if it's app-wide)
    document.body.style.backgroundImage = "url('assets/ustp_theme.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";

    // 1. Load existing section
    // Change to GET request, sending section_id in query params
    axios
      .get(`http://localhost/USTP-Student-Attendance-System/admin_backend/get_single_section.php?section_id=${id}`)
      .then((res) => {
        console.log("Response from get_single_section.php:", res.data); // Debugging
        if (res.data.success && res.data.section) {
          // Ensure section_id is set in formData for the update request later
          setFormData({ ...res.data.section, section_id: id });
        } else {
          // This alert will now correctly reflect if section is not found or other PHP issues
          alert(res.data.message || 'Failed to load section data.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching section data:", err); // Log the actual error
        alert('Error fetching section data. Please check console for details.');
        setLoading(false);
      });

    // 2. Load courses
    axios
      .get('http://localhost/ustp-student-attendance/admin_backend/get_courses.php') // Changed to get_courses.php as per previous file
      .then((res) => {
        console.log("Response from get_courses.php:", res.data); // Debugging
        if (res.data.success) {
          setCourses(res.data.courses);
        } else {
          console.warn("Failed to load courses:", res.data.message);
        }
      })
      .catch((err) => {
          console.error("Error fetching courses:", err);
      });
  }, [id]); // Dependency array: re-run if 'id' changes

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost/ustp-student-attendance/admin_backend/update_section.php', formData)
      .then((res) => {
        console.log("Response from update_section.php:", res.data); // Debugging
        if (res.data.success) {
          alert('Section updated!');
          navigate('/admin-sections');
        } else {
          alert(res.data.message || 'Update failed.');
        }
      })
      .catch((err) => {
        console.error("Error updating section:", err); // Log the actual error
        alert('Server error during update. Please check console for details.');
      });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ... rest of your JSX form (it looks correct)
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          Edit Section
        </h2>

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
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course:</label>
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_code}
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
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
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
              className="w-full border border-gray-300 rounded-md p-2"
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
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
        >
          Update Section
        </button>
      </form>
    </div>
  );
};

export default EditSection;