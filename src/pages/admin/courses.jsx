import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin_Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_course.php')
      .then(res => {
        console.log("API response:", res.data);
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else if (Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
        } else {
          console.error("Unexpected response format");
          setCourses([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch courses:", err);
        setError("Failed to fetch courses.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(course => {
    const coursename = `${course.course_name}`.toLowerCase();
    return coursename.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8">
      {/* Header: Go Back button + Course List Title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ← Go Back
          </button>
          <h1 className="text-2xl font-bold text-[#E55182]">Course List</h1>
        </div>
      </div>

      {/* Course count, search, and add course aligned in one row */}
      <div className="bg-white shadow-md p-6 rounded-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <p className="text-[#E55182] font-semibold">
            Total Courses: {filteredCourses.length}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{ width: '250px' }}
            />
            <button
              onClick={() => navigate("/admin-courses/add")}
              className="bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
            >
              + Add Course
            </button>
          </div>
        </div>

        {/* Courses Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm text-left text-pink-900">
            <thead className="bg-pink-100 uppercase text-pink-700">
              <tr>
                <th className="px-4 py-2">Course Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <tr
                    key={index}
                    className="border-b border-pink-200 hover:bg-pink-50"
                  >
                    <td className="px-4 py-2 truncate">{course.course_name}</td>
                    <td className="px-4 py-2 truncate">{course.description}</td>
                    <td className="px-4 py-2 truncate">
                      <button
                        onClick={() => navigate(`/admin-courses/edit/${course.course}`)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
