import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSection = () => {
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

  // Fetch courses
useEffect(() => {
  console.log("Sending formData:", formData);
  axios
    .get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_course.php')
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
    formData.course_id = parseInt(formData.course_id, 10);

    e.preventDefault();

    axios
      .post(
        'http://localhost/USTP-Student-Attendance-System/admin_backend/section_add.php',
        JSON.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        console.log("Server response:", res.data);
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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          Add New Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Name:
            </label>
            <input
              type="text"
              name="section_name"
              value={formData.section_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course:
            </label>
            {loadingCourses ? (
              <p className="text-gray-500">Loading courses...</p>
            ) : errorCourses ? (
              <p className="text-red-500">{errorCourses}</p>
            ) : (
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Course</option>
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_code}
                    </option>
                  ))
                ) : (
                  <option disabled>No courses available</option>
                )}

              </select>
            )}
          </div>

          {/* Schedule Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Day:
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time:
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time:
            </label>
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
};

export default AddSection;
