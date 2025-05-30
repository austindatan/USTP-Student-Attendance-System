import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AddExcuseRequest = ({ studentDetailsId }) => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [instructor, setInstructor] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [dateOfAbsence, setDateOfAbsence] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`http://localhost/USTP-Student-Attendance-System/api/student_backend/get_student_courses.php?student_details_id=${studentDetailsId}`)
      .then(res => {
        if (res.data.success) {
          setCourses(res.data.courses);
          setMessage('');
          setSuccess(null);
        }
      });
  }, [studentDetailsId]);

  useEffect(() => {
    if (!courseId) {
      setInstructor('');
      setInstructorId('');
      return;
    }
    axios
      .get(`http://localhost/USTP-Student-Attendance-System/api/student_backend/get_instructor_by_course.php?student_details_id=${studentDetailsId}&course_id=${courseId}`)
      .then(res => {
        if (res.data.success) {
          setInstructor(res.data.instructor_name || '');
          setInstructorId(res.data.instructor_id || '');
        } else {
          setInstructor('');
          setInstructorId('');
        }
      });
  }, [courseId, studentDetailsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('student_details_id', studentDetailsId);
    formData.append('instructor_id', instructorId);
    formData.append('reason', reason);
    formData.append('file', file);
    formData.append('date_of_absence', dateOfAbsence);

    try {
      const res = await axios.post('http://localhost/USTP-Student-Attendance-System/api/student_backend/submit_excuse_request.php', formData);
      if (res.data.message) {
        setMessage(res.data.message);
        setSuccess(res.data.success === true || res.data.success === "true");
      }

      if (res.data.success === true || res.data.success === "true") {
        setCourseId('');
        setInstructor('');
        setInstructorId('');
        setReason('');
        setFile(null);
        setDateOfAbsence('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

    } catch (err) {
      setMessage("Something went wrong.");
      setSuccess(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="font-dm-sans px-4 sm:px-10 py-6 sm:py-10 text-left w-full max-w-[85%] sm:max-w-2xl ml-4 sm:ml-[200px] text-sm sm:text-base mt-10 mb-10 bg-white rounded-lg shadow-lg transition-all duration-300 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Excuse Request Form</h2>

      {message && (
        <div
          className={`p-3 rounded border text-center ${
            success ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label htmlFor="course" className="block mb-2 font-medium">Course</label>
        <select
          id="course"
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="instructor" className="block mb-2 font-medium">Instructor</label>
        <input
          id="instructor"
          type="text"
          value={instructor}
          readOnly
          className="w-full border bg-gray-100 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="reason" className="block mb-2 font-medium">Reason</label>
        <textarea
          id="reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
          rows={4}
          className="w-full border rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="file" className="block mb-2 font-medium">Upload File (Optional)</label>
        <input
          id="file"
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="w-full focus:outline-none"
          ref={fileInputRef}
        />
      </div>

      <div>
        <label htmlFor="dateOfAbsence" className="block mb-2 font-medium">Date of Absence</label>
        <input
          id="dateOfAbsence"
          type="date"
          value={dateOfAbsence}
          onChange={e => setDateOfAbsence(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
      >
        Submit
      </button>
    </form>
  );
};

export default AddExcuseRequest;
