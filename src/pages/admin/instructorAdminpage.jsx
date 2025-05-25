import React, { useEffect, useState } from "react";

const InstructorAdminPage = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetch("http://localhost/ustp-student-attendance/admin_backend/get_instructor_info.php")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setInstructors(data);
        } else {
          console.error(data.error);
        }
      })
      .catch((err) => console.error("Failed to fetch instructors:", err));
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700 text-center sm:text-left">
        Instructor List
      </h1>

      <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg overflow-x-auto">
        {instructors.length === 0 ? (
          <p className="text-center text-gray-600">Loading instructor data or no instructors found.</p>
        ) : (
          <table className="min-w-full text-left text-sm text-blue-900">
            <thead className="bg-blue-100 uppercase text-blue-700">
              <tr>
                <th className="px-2 sm:px-4 py-2">First Name</th>
                <th className="px-2 sm:px-4 py-2">Middle Name</th>
                <th className="px-2 sm:px-4 py-2">Last Name</th>
                <th className="px-2 sm:px-4 py-2">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst, index) => (
                <tr
                  key={index}
                  className="border-b border-blue-200 hover:bg-blue-50"
                >
                  <td className="px-2 sm:px-4 py-2 truncate max-w-[100px] sm:max-w-none">{inst.firstname}</td>
                  <td className="px-2 sm:px-4 py-2 truncate max-w-[100px] sm:max-w-none">{inst.middlename}</td>
                  <td className="px-2 sm:px-4 py-2 truncate max-w-[100px] sm:max-w-none">{inst.lastname}</td>
                  <td className="px-2 sm:px-4 py-2 truncate max-w-[120px] sm:max-w-none">{inst.date_of_birth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InstructorAdminPage;
