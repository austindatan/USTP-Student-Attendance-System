import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin_Sections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_section.php')
      .then(res => {
        console.log("API response:", res.data);
        if (Array.isArray(res.data)) {
          setSections(res.data);
        } else if (Array.isArray(res.data.sections)) {
          setSections(res.data.sections);
        } else {
          console.error("Unexpected response format");
          setSections([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch sections:", err);
        setError("Failed to fetch sections.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter sections based on searchTerm (case insensitive)
  const filteredSections = sections.filter(section => {
    const sectionname = `${section.section_name}`.toLowerCase();
    return sectionname.includes(searchTerm.toLowerCase());
  });

  return (
    <div
      className="h-full min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url('assets/white_theme.png')" }}
    >
      <section className="max-w-[1200px] mx-auto pt-12 px-4 sm:px-6 md:px-[60px] lg:px-[100px]">
        <main className="flex-1 px-4 py-6 sm:p-8 text-left text-base sm:text-lg mt-[20px] mb-[20px] bg-white border-2 border-[#E55182] rounded-lg shadow-lg">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="mb-4 bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
          >
            ← Go Back
          </button>

          <div className="flex justify-between items-center mb-4">
            <p className="text-[#E55182] font-semibold">
              Total Sections: {filteredSections.length}
            </p>

            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-4 px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{ maxWidth: '250px' }}
            />

            <button
              onClick={() => navigate("/admin-students/add")}
              className="bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
            >
              + Add Section
            </button>
          </div>

          <h1 className="text-2xl font-bold text-[#E55182] mb-4">Section List</h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading sections...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="relative">
              <div className="pb-4 bg-white overflow-x-auto">
                <table className="w-full table-fixed text-sm text-left text-pink-900">
                  <thead className="text-xs uppercase bg-pink-100 text-pink-700">
                    <tr>
                      <th className="w-40 px-4 py-3 truncate">Section Name</th>
                      <th className="w-40 px-4 py-3 truncate">Course Name</th>
                      <th className="w-28 px-4 py-3 truncate">Schedule Day</th>
                      <th className="w-28 px-4 py-3 truncate">Start Time</th>
                      <th className="w-28 px-4 py-3 truncate">End Time</th>
                      <th className="w-28 px-4 py-3 truncate">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSections.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                          No sections found.
                        </td>
                      </tr>
                    ) : (
                      filteredSections.map((section, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b border-pink-200 hover:bg-pink-50"
                        >
                          <td className="px-4 py-4 truncate">{section.section_name}</td>
                          <td className="px-4 py-4 truncate">{section.course_name}</td>
                          <td className="px-4 py-4 truncate">{section.schedule_day}</td>
                          <td className="px-4 py-4 truncate">{section.start_time}</td>
                          <td className="px-4 py-4 truncate">{section.end_time}</td>
                          <td className="px-4 py-4 truncate">
                            <button
                              onClick={() => navigate(`/admin-students/edit/${section.section}`)}
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
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
