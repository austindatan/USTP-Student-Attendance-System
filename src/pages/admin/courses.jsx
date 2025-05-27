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
        // You've correctly handled potential different data structures here
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else if (Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
        } else {
          // If neither is an array, log the unexpected data and set courses to empty array
          console.error("Unexpected data format from get_course.php:", res.data);
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching courses:", err); // Log the actual error
        setError("Failed to fetch courses. Please check the server.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ADJUSTMENT: Safely filter by course_code
  const filteredCourses = courses.filter(course =>
    // Use optional chaining (?.) to safely access course_code
    // Use nullish coalescing (?? '') to default to an empty string if course_code is null/undefined
    // This prevents calling .toLowerCase() on undefined
    (course.course_code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0">

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
              <h1 className="text-2xl text-blue-700 font-bold">Courses Lists</h1>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
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
            <div className="overflow-auto rounded-md">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    {/* ADJUSTMENT: Changed header to Course Code */}
                    <th className="px-4 py-2 whitespace-nowrap">Course Code</th>
                    <th className="px-4 py-2 whitespace-nowrap">Description</th>
                    <th className="px-4 py-2 whitespace-nowrap">Action</th>
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
                        // ADJUSTMENT: Use course.course_id as key if available and unique
                        // If course_id is not guaranteed unique, you might stick with index,
                        // but course_id is generally preferred for stable keys.
                        key={course.course_id || course.course_code} // Fallback to course_code if id isn't there
                        className="border-b border-blue-200 hover:bg-blue-50"
                      >
                        {/* ADJUSTMENT: Display course_code instead of course_name */}
                        <td className="px-4 py-2 max-w-xs truncate">{course.course_code}</td>
                        <td className="px-4 py-2 max-w-md truncate">{course.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            // ADJUSTMENT: Pass course_id for edit navigation
                            // Ensure your edit course route in App.js expects course_id
                            onClick={() => navigate(`/admin-courses/edit/${course.course_id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
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