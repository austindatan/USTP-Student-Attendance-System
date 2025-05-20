import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // import useNavigate

export default function Admin_Students() {
  const [student, setStudents] = React.useState([]);
  const navigate = useNavigate();  // initialize navigate

  useEffect(() => {
    axios.get('http://localhost/USTP-Student-Attendance-System/src/student_api.php')
      .then(res => {
        setStudents(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
      });
  }, []);

  return (
    <div
      className="h-full min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url('assets/white_theme.png')" }}
    >
      <section className="max-w-[1200px] mx-auto pt-12 px-4 sm:px-6 md:px-[60px] lg:px-[100px]">
        <main className="flex-1 px-4 py-6 sm:p-8 text-left text-base sm:text-lg mt-[20px] mb-[20px] bg-white border-2 border-[#E55182] rounded-lg shadow-lg">
          {/* Go Back Button */}
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="mb-4 bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
          >
            ← Go Back
          </button>

          <h1 className="text-2xl font-bold text-[#E55182] mb-4">Student List</h1>

          <div className="relative">
            <div className="pb-4 bg-white overflow-x-auto">
              <table className="w-full table-fixed text-sm text-left text-pink-900">
                <thead className="text-xs uppercase bg-pink-100 text-pink-700">
                  <tr>
                    <th className="w-40 px-4 py-3 truncate">Full Name</th>
                    <th className="w-28 px-4 py-3 truncate">Birthdate</th>
                    <th className="w-28 px-4 py-3 truncate">Contact Number</th>
                  </tr>
                </thead>

                <tbody>
                  {student.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  )}
                  {student.map((student, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b border-pink-200 hover:bg-pink-50"
                    >
                      <td className="px-4 py-4 truncate text-pink-900">
                        {student.firstname} {student.middlename} {student.lastname}
                      </td>
                      <td className="px-4 py-4 truncate">{student.date_of_birth}</td>
                      <td className="px-4 py-4 truncate">{student.contact_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
