import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin_Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/student_api.php')
      .then(res => {
        console.log("API response:", res.data);
        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else if (Array.isArray(res.data.students)) {
          setStudents(res.data.students);
        } else {
          setStudents([]);
        }
      })
      .catch(() => setError("Failed to fetch students."))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700 whitespace-nowrap">
            Student List
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <p className="text-blue-700 font-semibold whitespace-nowrap">
            Total Students: {filteredStudents.length}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
            />
            <button
              onClick={() => navigate("/admin-students/add")}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading students...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
              <thead className="bg-blue-100 uppercase text-blue-700">
                <tr>
                  <th className="px-3 py-2">Student ID</th>
                  <th className="px-3 py-2">Full Name</th>
                  <th className="px-3 py-2">Program</th>
                  <th className="px-3 py-2">Section</th>
                  <th className="px-3 py-2">Birthdate</th>
                  <th className="px-3 py-2">Contact Number</th>
                  <th className="px-3 py-2">Address</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={index}
                      className="border-b border-blue-200 hover:bg-blue-50"
                    >
                      <td className="px-3 py-2 truncate">{student.student_id}</td>
                      <td className="px-3 py-2 truncate">
                        {student.firstname} {student.middlename} {student.lastname}
                      </td>
                      <td className="px-3 py-2 truncate">{student.program_name}</td>
                      <td className="px-3 py-2 truncate">{student.section_name}</td>
                      <td className="px-3 py-2 truncate">{student.date_of_birth}</td>
                      <td className="px-3 py-2 truncate">{student.contact_number}</td>
                      <td className="px-3 py-2 truncate">
                        {student.street} {student.city} {student.province} {student.zipcode}
                      </td>
                      <td className="px-3 py-2 truncate">
                        <button
                          onClick={() => navigate(`/admin-students/edit/${student.student_id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm"
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
    </div>
  );
}
