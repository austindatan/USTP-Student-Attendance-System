import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InstructorAdminPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/ustp-student-attendance/admin_backend/get_instructor_info.php')
      .then((res) => {
        if (!res.data.error) {
          setInstructors(res.data);
        } else {
          console.error(res.data.error);
          setInstructors([]);
        }
      })
      .catch(() => setError("Failed to fetch instructors."))
      .finally(() => setLoading(false));
  }, []);

  const filteredInstructors = instructors.filter((instructor) => {
    const fullName = `${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex flex-col overflow-y-auto">
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
              <h1 className="text-2xl text-blue-700 font-bold">Instructor List</h1>
            )}
          </div>
        </div>

        {/* Controls & Table */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <p className="text-blue-700 font-semibold whitespace-nowrap">
              Total Instructors: {filteredInstructors.length}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
              />
              <button
                onClick={() => navigate("/admin-instructor/add")}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
              >
                + Add Instructor
              </button>
            </div>
          </div>

          {/* Table wrapper with horizontal scroll on mobile */}
          {loading ? (
            <p className="text-center text-gray-500">Loading instructors...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    <th className="px-3 py-2">First Name</th>
                    <th className="px-3 py-2">Middle Name</th>
                    <th className="px-3 py-2">Last Name</th>
                    <th className="px-3 py-2">Date of Birth</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstructors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                        No instructors found.
                      </td>
                    </tr>
                  ) : (
                    filteredInstructors.map((instructor, index) => (
                      <tr key={index} className="border-b border-blue-200 hover:bg-blue-50">
                        <td className="px-3 py-2 truncate max-w-[120px]">{instructor.firstname}</td>
                        <td className="px-3 py-2 truncate max-w-[120px]">{instructor.middlename}</td>
                        <td className="px-3 py-2 truncate max-w-[140px]">{instructor.lastname}</td>
                        <td className="px-3 py-2 truncate max-w-[110px]">{instructor.date_of_birth}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/admin-instructor/edit/${instructor.instructor_id}`)}
                            className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
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
