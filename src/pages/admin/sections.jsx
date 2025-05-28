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
        // Log the data to inspect its structure if needed
        console.log("Fetched sections data:", res.data); 
        if (Array.isArray(res.data)) {
          setSections(res.data);
        } else if (res.data && Array.isArray(res.data.sections)) { // Check if res.data exists before accessing .sections
          setSections(res.data.sections);
        } else {
          setSections([]);
          // Optionally, set an error if the data format is unexpected but not a network error
          if (res.data !== null && res.data !== undefined && typeof res.data === 'object') {
              console.warn("Unexpected data format for sections:", res.data);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching sections:", err); // Log the actual error
        setError("Failed to fetch sections. Please check your network or server.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredSections = sections.filter(section =>
    section.section_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    // Make sure 'assets/teacher_vector.png' is correctly served from your public folder
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
              <h1 className="text-2xl text-blue-700 font-bold">Section List</h1>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <p className="text-blue-700 font-semibold whitespace-nowrap">
              Total Sections: {filteredSections.length}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
              />
              <button
                onClick={() => navigate("/admin-sections/add")}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
              >
                + Add Section
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center text-gray-500">Loading sections...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    <th className="px-3 py-2">Section Name</th>
                    <th className="px-3 py-2">Course Name</th>
                    <th className="px-3 py-2">Schedule Day</th>
                    <th className="px-3 py-2">Start Time</th>
                    <th className="px-3 py-2">End Time</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSections.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                        No sections found.
                      </td>
                    </tr>
                  ) : (
                    filteredSections.map((section, index) => (
                      <tr
                        key={index}
                        className="border-b border-blue-200 hover:bg-blue-50"
                      >
                        <td className="px-3 py-2 truncate max-w-[120px]">{section.section_name}</td>
                        <td className="px-3 py-2 truncate max-w-[140px]">{section.course_name}</td>
                        <td className="px-3 py-2 truncate max-w-[110px]">{section.schedule_day}</td>
                        <td className="px-3 py-2 truncate max-w-[90px]">{section.start_time}</td>
                        <td className="px-3 py-2 truncate max-w-[90px]">{section.end_time}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => navigate(`/admin-edit-section/${section.section_id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
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