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
        if (Array.isArray(res.data)) {
          setSections(res.data);
        } else if (Array.isArray(res.data.sections)) {
          setSections(res.data.sections);
        } else {
          setSections([]);
        }
      })
      .catch(() => setError("Failed to fetch sections."))
      .finally(() => setLoading(false));
  }, []);

  const filteredSections = sections.filter(section => {
    return section.section_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-700">Section List</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
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

        {/* Table container with horizontal scroll */}
        {loading ? (
          <p className="text-center text-gray-500">Loading sections...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
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
                          onClick={() => navigate(`/admin-sections/edit/${section.section}`)}
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
    </div>
  );
}
