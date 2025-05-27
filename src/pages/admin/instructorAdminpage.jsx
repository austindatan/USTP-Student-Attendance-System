import React, { useEffect, useState } from "react";

const InstructorAdminPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("http://localhost/ustp-student-attendance-system/admin_backend/get_instructor_info.php")
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
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-[-1]">

      {/* Header */}
      <div
        className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
        style={
            !loading
            ? {
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
            <>
                <h1 className="text-2xl text-blue-700 font-bold">Instructor Lists</h1>
            </>
            )}
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg overflow-x-auto">
        {instructors.length === 0 ? (
          <p>Loading instructor data or no instructors found.</p>
        ) : (
          <table className="w-full text-left text-sm text-blue-900">
            <thead className="bg-blue-100 uppercase text-blue-700">
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Middle Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst, index) => (
                <tr
                  key={index}
                  className="border-b border-blue-200 hover:bg-blue-50"
                >
                  <td className="px-4 py-2 truncate">{inst.firstname}</td>
                  <td className="px-4 py-2 truncate">{inst.middlename}</td>
                  <td className="px-4 py-2 truncate">{inst.lastname}</td>
                  <td className="px-4 py-2 truncate">{inst.date_of_birth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </section>
    </div>
  );
};

export default InstructorAdminPage;
