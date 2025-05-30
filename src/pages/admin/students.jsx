import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin_Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "http://localhost/USTP-Student-Attendance-System/admin_backend/student_api.php"
      );

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.students)) {
        data = res.data.students;
      }

      data.sort((a, b) => a.student_id - b.student_id);
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    axios.post('http://localhost/USTP-Student-Attendance-System/admin_backend/delete_student.php', {
      _method: 'DELETE',
      student_id: selectedStudent.student_id,
    })
    .then((res) => {
      if (res.data.success) {
        // Refresh or filter out the deleted student
        setStudents(students.filter(s => s.student_id !== selectedStudent.student_id));
      } else {
        alert(res.data.message || "Failed to delete student.");
      }
    })
    .catch(() => alert("An error occurred while deleting."))
    .finally(() => {
      setIsModalOpen(false);
      setSelectedStudent(null);
    });
  };

  const filteredStudents = students.filter((student) => {
    // Include enrolled_classes in the search if needed
    const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.toLowerCase();
    const enrolledClasses = (student.enrolled_classes || '').toLowerCase(); // Added for search
    return fullName.includes(searchTerm.toLowerCase()) || enrolledClasses.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0">

        <div
          className="bg-white rounded-lg p-6 mb-6 relative overflow-hidden"
          style={
            !loading
              ? {
                  backgroundImage: "url('assets/teacher_vector.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right",
                  backgroundSize: "contain",
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
              <h1
                className="text-2xl text-blue-700 font-bold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Student List
              </h1>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
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

          {loading ? (
            <p className="text-center text-gray-500">Loading students...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse table-fixed w-full">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    <th className="px-3 py-2 w-[8%]">Stu. ID</th>
                    <th className="px-3 py-2 w-[22%]">Full Name</th>
                    {/* Changed from 'Section' to 'Enrolled Classes' */}
                    <th className="px-3 py-2 w-[20%]">Enrolled Classes</th> 
                    <th className="px-3 py-2 w-[15%]">Program</th>
                    <th className="px-3 py-2 w-[12%]">Birthdate</th>
                    <th className="px-3 py-2 w-[13%]">Contact Number</th>
                    <th className="px-3 py-2 w-[20%]">Address</th>
                    <th className="px-3 py-2 w-[10%] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      {/* Updated colSpan to 8 (added 1 for Enrolled Classes, adjusted others) */}
                      <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.student_id}
                        className="border-b border-blue-200 hover:bg-blue-50"
                      >
                        <td className="px-3 py-2 truncate min-w-0">{student.student_id}</td>
                        <td className="px-3 py-2 truncate min-w-0">
                          {student.firstname} {student.middlename} {student.lastname}
                        </td>
                        {/* Display the new enrolled_classes field */}
                        <td className="px-3 py-2 truncate min-w-0">{student.enrolled_classes}</td>
                        <td className="px-3 py-2 truncate min-w-0">{student.program_name}</td>
                        <td className="px-3 py-2 truncate min-w-0">{student.date_of_birth}</td>
                        <td className="px-3 py-2 truncate min-w-0">{student.contact_number}</td>
                        <td className="px-3 py-2 truncate min-w-0">
                          {student.street} {student.city} {student.province} {student.zipcode}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() =>
                                navigate(`/admin-students/edit/${student.student_id}`)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(student)}
                              className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Delete Confirmation Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedStudent.firstname} {selectedStudent.lastname} </span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}