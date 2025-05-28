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

        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else if (Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
        } else {
          console.error("Unexpected data format from get_course.php:", res.data);
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses. Please check the server.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(course =>
    (course.course_code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (course.course_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex overflow-auto scrollbar-thin">
      <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">

        {/* Header */}
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={
            !loading
              ? {
                  backgroundImage: "url('assets/teacher_vector.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right",
                  backgroundSize: "contain"
                }
              : {}
          }
        >
          <div className="leading-none">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="w-1/3 h-4 bg-white/50 rounded"></div>
                <div className="w-1/2 h-8 bg-white/60 rounded"></div>
              </div>
            ) : (
              <h1 className="text-2xl text-blue-700 font-bold">Course List</h1>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <p className="text-blue-700 font-semibold whitespace-nowrap">
              Total Courses: {filteredCourses.length}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
              />
              <button
                onClick={() => navigate("/admin-courses/add")}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
              >
                + Add Course
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center text-gray-500">Loading courses...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    <th className="px-3 py-2">Course Code</th>
                    <th className="px-3 py-2">Course Name</th> 
                    <th className="px-3 py-2">Action</th>
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
                    filteredCourses.map((course) => (
                      <tr
                        key={course.course_id ?? course.course_code}
                        className="border-b border-blue-200 hover:bg-blue-50"
                      >
                        <td className="px-3 py-2 max-w-[120px] truncate">{course.course_code}</td>
                        <td className="px-3 py-2 max-w-[200px] truncate">{course.course_name}</td> {/* CHANGED: From "course.description" to "course.course_name" */}
                        <td className="px-3 py-2">
                          <button
                            onClick={() => navigate(`/admin-courses/edit/${course.course_id}`)}
                            className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}