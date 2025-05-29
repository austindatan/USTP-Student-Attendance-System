import React, { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch('http://localhost/ustp-student-attendance/student_backend/get_attendance_summary.php');
        const data = await res.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Failed to fetch attendance summary:', error);
        setAttendanceData([]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <section className="w-full pt-12 px-6 sm:px-6 md:px-12">
      {/* Attendance Summary Table */}
      <div className="bg-white rounded-lg shadow p-6 w-full lg:w-3/4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Attendance Summary</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Present</th>
                <th className="px-4 py-2">Absent</th>
                <th className="px-4 py-2">Late</th>
                <th className="px-4 py-2">Excused</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? Array.from({ length: 5 }) : attendanceData).map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  {isLoading ? (
                    <td colSpan="6" className="px-4 py-2 animate-pulse text-center text-gray-400">
                      Loading...
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-2">{item.course}</td>
                      <td className="px-4 py-2">{item.teacher}</td>
                      <td className="px-4 py-2">{item.present}</td>
                      <td className="px-4 py-2">{item.absent}</td>
                      <td className="px-4 py-2">{item.late}</td>
                      <td className="px-4 py-2">{item.excused}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
