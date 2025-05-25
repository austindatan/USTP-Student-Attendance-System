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
          console.error("Unexpected response format");
          setStudents([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
        setError("Failed to fetch students.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ← Go Back
          </button>
          <h1 className="text-2xl font-bold text-[#E55182]">Student List</h1>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <p className="text-[#E55182] font-semibold">
            Total Students: {filteredStudents.length}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{ maxWidth: '250px' }}
            />
            <button
              onClick={() => navigate("/admin-students/add")}
              className="bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
            >
              + Add Student
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading students...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm text-left text-pink-900">
            <thead className="bg-pink-100 uppercase text-pink-700">
              <tr>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Birthdate</th>
                <th className="px-4 py-2">Contact Number</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b border-pink-200 hover:bg-pink-50"
                  >
                    <td className="px-4 py-2 truncate">{student.student_id}</td>
                    <td className="px-4 py-2 truncate">
                      {student.firstname} {student.middlename} {student.lastname}
                    </td>
                    <td className="px-4 py-2 truncate">{student.date_of_birth}</td>
                    <td className="px-4 py-2 truncate">{student.contact_number}</td>
                    <td className="px-4 py-2 truncate">
                      {student.street} {student.city} {student.province} {student.zipcode}
                    </td>
                    <td className="px-4 py-2 truncate">
                      <button
                        onClick={() => navigate(`/admin-students/edit/${student.student_id}`)}
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
