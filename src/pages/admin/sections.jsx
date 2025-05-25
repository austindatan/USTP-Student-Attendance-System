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

  const filteredSections = sections.filter(section => {
    const sectionname = `${section.section_name}`.toLowerCase();
    return sectionname.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8">
      {/* Header: Go Back button and Section List Title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ← Go Back
          </button>
          <h1 className="text-2xl font-bold text-[#E55182]">Section List</h1>
        </div>
      </div>

      {/* Section count + Search bar + Add Section button aligned */}
      <div className="bg-white shadow-md p-6 rounded-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <p className="text-[#E55182] font-semibold">
            Total Sections: {filteredSections.length}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{ width: '250px' }}
            />
            <button
              onClick={() => navigate("/admin-sections/add")}
              className="bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
            >
              + Add Section
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading sections...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm text-left text-pink-900">
            <thead className="bg-pink-100 uppercase text-pink-700">
              <tr>
                <th className="px-4 py-2">Section Name</th>
                <th className="px-4 py-2">Course Name</th>
                <th className="px-4 py-2">Schedule Day</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Action</th>
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
                    className="border-b border-pink-200 hover:bg-pink-50"
                  >
                    <td className="px-4 py-2 truncate">{section.section_name}</td>
                    <td className="px-4 py-2 truncate">{section.course_name}</td>
                    <td className="px-4 py-2 truncate">{section.schedule_day}</td>
                    <td className="px-4 py-2 truncate">{section.start_time}</td>
                    <td className="px-4 py-2 truncate">{section.end_time}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate(`/admin-sections/edit/${section.section}`)}
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
