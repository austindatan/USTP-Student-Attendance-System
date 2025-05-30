import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AddExcuseRequest = ({ studentDetailsId }) => {
  console.log("AddExcuseRequest (render): received studentDetailsId prop =", studentDetailsId); 

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [instructor, setInstructor] = useState(null);
  const [instructorId, setInstructorId] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [dateOfAbsence, setDateOfAbsence] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);


useEffect(() => {
  console.log("AddExcuseRequest (useEffect): studentDetailsId in dependency array =", studentDetailsId);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `http://localhost/USTP-Student-Attendance-System/api/student_backend/get_student_courses.php?student_details_id=${studentDetailsId}`
      );

      console.log("API response:", res.data);

      if (res.data?.success && res.data.courses.length > 0) {
        setCourses(res.data.courses);
        setError('');
      } else if (res.data?.success && res.data.courses.length === 0) {
        setCourses([]);
        setError('No courses found for this student.');
      } else {
        setError('Failed to load courses.');
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setMessage("Error loading courses.");
      setSuccess(false);
    }
  };

  if (studentDetailsId) {
    console.log("AddExcuseRequest (useEffect): studentDetailsId is truthy, fetching courses...");
    fetchCourses();
    } else {
      console.log("AddExcuseRequest (useEffect): studentDetailsId is falsy, NOT fetching courses."); // Added this
    }
  }, [studentDetailsId]);


  useEffect(() => {
    const fetchInstructorByCourse = async () => {
      if (!courseId) return;

    try {
        const res = await axios.get(`http://localhost/USTP-Student-Attendance-System/api/student_backend/get_instructor_by_course.php?student_details_id=${studentDetailsId}&course_id=${courseId}`);
        console.log("Instructor API response:", res.data); 
        if (res.data.success && res.data.instructor) {
            setInstructor(res.data.instructor);
            setInstructorId(res.data.instructor.instructor_id);
            console.log("Instructor ID set to:", res.data.instructor.instructor_id);
        } else {
            console.log("Instructor not found or API failed, instructorId reset.");
        }
    } catch (err) {
        console.error("Error fetching instructor:", err); 
      }
    };

    fetchInstructorByCourse();
  }, [courseId, studentDetailsId]);

  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    setCourseId(selectedId);
    setInstructor(null);
    setInstructorId('');
    setMessage('');
    setSuccess(null);
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('student_details_id', studentDetailsId);
    formData.append('instructor_id', instructorId);
    formData.append('reason', reason);
    formData.append('file', file); 
    formData.append('date_of_absence', dateOfAbsence);

    console.log("Preparing to submit form with FormData:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    setLoading(true);
    setMessage('');
    setSuccess(null);

    try {
        const res = await axios.post('http://localhost/USTP-Student-Attendance-System/api/student_backend/submit_excuse_request.php', formData);
        setMessage(res.data.message);
        const isSuccess = res.data.success === true || res.data.success === "true";
        setSuccess(isSuccess);

        if (isSuccess) {
            setCourseId('');
            setInstructor(null);
            setInstructorId('');
            setReason('');
            setFile(null);
            setDateOfAbsence('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    } catch (err) {
        console.error("Axios submission error:", err);
        setMessage("Something went wrong. Check console for details.");
        setSuccess(false);
    } finally {
        setLoading(false);
    }
};


  return (
    <form 
      onSubmit={handleSubmit}
      className="font-dm-sans px-4 sm:px-10 py-6 sm:py-10 text-left w-full max-w-[85%] sm:max-w-2xl ml-4 sm:ml-[200px] text-sm sm:text-base mt-10 mb-10 bg-white rounded-lg shadow-lg transition-all duration-300 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Excuse Request Form</h2>

      {message && (
        <div className={`p-3 rounded border text-center ${success ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}>
          {message}
        </div>
      )}

      <div>
        <label htmlFor="course" className="block mb-2 font-medium">Course</label>
        <select
          id="course"
          value={courseId}
          onChange={handleCourseChange}
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
          value={instructor ? `${instructor.firstname} ${instructor.lastname}` : ''}
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
        disabled={loading}
        className={`w-full text-white font-semibold py-3 rounded transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default AddExcuseRequest;
