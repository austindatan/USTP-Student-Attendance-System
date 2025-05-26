import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentNavbar from "../../components/StudentNavbar";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const subjectsData = [
    { subject: "Life and Works of Rizal", teacher: "Mr. Santos", presents: 18, absences: 2 },
    { subject: "Contemporary World", teacher: "Ms. Reyes", presents: 20, absences: 0 },
    { subject: "Ethics", teacher: "Dr. Cruz", presents: 19, absences: 1 },
    { subject: "PathFit", teacher: "Coach Garcia", presents: 17, absences: 3 },
    { subject: "Art Appreciation", teacher: "Ms. Del Rosario", presents: 16, absences: 4 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <StudentNavbar />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <main className="max-w-6xl mx-auto space-y-10">

          {/* Attendance Summary */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 text-center">
              Attendance Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg shadow text-sm sm:text-base">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Subject</th>
                    <th className="border px-4 py-2 text-left">Teacher</th>
                    <th className="border px-4 py-2 text-center">Presents</th>
                    <th className="border px-4 py-2 text-center">Absences</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsData.map(({ subject, teacher, presents, absences }) => (
                    <tr key={subject} className="hover:bg-blue-50">
                      <td className="border px-4 py-2">{subject}</td>
                      <td className="border px-4 py-2">{teacher}</td>
                      <td className="border px-4 py-2 text-center text-green-700 font-medium">{presents}</td>
                      <td className="border px-4 py-2 text-center text-red-700 font-medium">{absences}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upload and Download */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Upload Section */}
            <div className="bg-blue-50 p-5 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-800 text-center mb-4">
                Upload your document here
              </h3>
              <div
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition"
                onClick={() => document.getElementById("documentUpload").click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25"
                  />
                </svg>
                <p className="text-blue-700 text-sm text-center">Click or drag files to upload</p>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="documentUpload"
                  onChange={(e) => console.log("Files selected:", e.target.files)}
                />

                <label
                  htmlFor="documentUpload"
                  className="px-4 py-2 bg-blue-700 text-white text-sm rounded hover:bg-blue-800 transition"
                >
                  Select Files
                </label>
              </div>
            </div>

          {/* Download Section */}
<div className="bg-blue-50 p-5 rounded-lg shadow-md">
  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 text-center mb-4">
    Download data
  </h3>
  <div
    className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition"
    onClick={() => alert("Download functionality to be implemented")}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 text-blue-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
      />
    </svg>
    <p className="text-blue-700 text-sm text-center">Download CSV data</p>
    <button className="px-4 py-2 bg-blue-700 text-white text-sm rounded hover:bg-blue-800 transition">
      Download
    </button>
  </div>
</div>

          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
