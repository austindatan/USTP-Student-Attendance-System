import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditStudent() {
  const { student_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    date_of_birth: '',
    contact_number: '',
    email: '',
    password: '',
    street: '',
    city: '',
    province: '',
    zipcode: '',
    country: '',
    section_id: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [sections, setSections] = useState([]);
  const [programDetails, setProgramDetails] = useState([]);

  // New states for Year Level and Semester
  const [yearLevels, setYearLevels] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYearLevel, setSelectedYearLevel] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  // fetch sections based on filters
  // currentSectionId is passed to help determine if the selected section should be reset
  const fetchSections = useCallback(async (yearLevelId, semesterId, currentSectionId) => {
    try {
      const params = {};
      if (yearLevelId) {
        params.year_level_id = yearLevelId;
      }
      if (semesterId) {
        params.semester_id = semesterId;
      }
      const secRes = await axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/section_dropdown.php', { params });
      setSections(secRes.data);

      // Determine if the current section_id is still valid in the new list of sections
      const isCurrentSectionValid = secRes.data.some(sec => String(sec.section_id) === String(currentSectionId));

      // If there's a currentSectionId but it's not in the new list, clear it.
      // Otherwise, keep the current section_id.
      if (currentSectionId && !isCurrentSectionValid) {
        setFormData(prev => ({ ...prev, section_id: '' }));
      } else if (currentSectionId && isCurrentSectionValid) {
        // Explicitly set it if it's valid, ensures it doesn't get cleared by other effects
        setFormData(prev => ({ ...prev, section_id: currentSectionId }));
      } else if (!currentSectionId) {
        // If there was no currentSectionId, ensure it's empty
        setFormData(prev => ({ ...prev, section_id: '' }));
      }

    } catch (error) {
      console.error('Error fetching filtered sections:', error);
      alert('Failed to load sections. Please try again.');
    }
  }, []); // Removed formData.section_id from dependency array for useCallback

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, progRes, yearRes, semRes, studentRes] = await Promise.all([
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/instructor_dropdown.php'),
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/pd_dropdown.php'),
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_year_levels.php'),
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_semesters.php'),
          // IMPORTANT: Ensure student_get_api.php returns year_level_id and semester_id
          axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/student_get_api.php?student_id=${student_id}`),
        ]);

        setInstructors(instRes.data);
        setProgramDetails(progRes.data);
        setYearLevels(yearRes.data);
        setSemesters(semRes.data);

        const student = studentRes.data;
        
        // Store the original section_id before potentially modifying formData
        const initialSectionId = student.section_id || '';
        const initialYearLevel = student.year_level_id || '';
        const initialSemester = student.semester_id || '';

        setFormData({
          firstname: student.firstname || '',
          middlename: student.middlename || '',
          lastname: student.lastname || '',
          date_of_birth: student.date_of_birth || '',
          contact_number: student.contact_number || '',
          email: student.email || '',
          password: '', // Password should ideally not be pre-filled for security
          street: student.street || '',
          city: student.city || '',
          province: student.province || '',
          zipcode: student.zipcode || '',
          country: student.country || '',
          section_id: initialSectionId, // Set initial section_id here
        });

        setSelectedInstructor(student.instructor_id || '');
        setSelectedProgram(student.program_details_id || '');
        setSelectedYearLevel(initialYearLevel); // Set initial year level
        setSelectedSemester(initialSemester);   // Set initial semester

        // Explicitly fetch sections after setting initial year/semester and formData.section_id
        // Pass the student's initial section_id to fetchSections to handle its validity
        await fetchSections(initialYearLevel, initialSemester, initialSectionId);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        alert('Failed to load student or dropdown data.');
        navigate('/admin-students');
      }
    };
    fetchData();
  }, [student_id, navigate, fetchSections]); // fetchSections is a dependency because it's used inside fetchData

  // This useEffect handles changes ONLY when the user selects year/semester
  useEffect(() => {
      // Only fetch sections if year level or semester has been selected
      // and it's not the initial load where fetchData already handled it.
      // We check if selectedYearLevel or selectedSemester are not empty strings.
      if (selectedYearLevel || selectedSemester) {
          fetchSections(selectedYearLevel, selectedSemester, formData.section_id);
      }
  }, [selectedYearLevel, selectedSemester, fetchSections]); // formData.section_id is not a dependency here to avoid loops

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    submissionData.append('instructor_id', selectedInstructor);
    submissionData.append('program_details_id', selectedProgram);
    // Note: year_level_id and semester_id are only for filtering sections on the frontend,
    // they are not directly updated in the student's database record.
    // They don't need to be sent in the update API if they are not fields in the student or student_details tables.
    // However, if your student_update_api.php expects them for some reason, keep them.
    // Based on your student_update_api.php, these are not directly used for update.
    // submissionData.append('year_level_id', selectedYearLevel);
    // submissionData.append('semester_id', selectedSemester);
    
    if (imageFile) submissionData.append('image', imageFile);

    try {
      const res = await axios.post(
        `http://localhost/USTP-Student-Attendance-System/admin_backend/student_update_api.php?student_id=${student_id}`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert(res.data.message || 'Student updated successfully!');
      navigate('/admin-students');
    } catch (error) {
      console.error('Failed to update student:', error.response?.data || error.message);
      alert(`Error updating student: ${error.response?.data?.message || 'Please check the console.'}`);
    }
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/teacher_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Edit Student</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4"
          encType="multipart/form-data"
        >
          {[
            ['firstname', 'First Name'],
            ['middlename', 'Middle Name'],
            ['lastname', 'Last Name'],
            ['date_of_birth', 'Date of Birth', 'date'],
            ['contact_number', 'Contact Number'],
            ['email', 'Email', 'email'],
            ['password', 'Password', 'password'],
            ['street', 'Street'],
            ['city', 'City'],
            ['province', 'Province'],
            ['zipcode', 'Zipcode'],
            ['country', 'Country'],
          ].map(([name, label, type = 'text']) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-blue-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={['firstname', 'lastname', 'date_of_birth', 'contact_number', 'email'].includes(name)}
                className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
                autoComplete={name === 'password' ? 'new-password' : undefined}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-blue-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700">Instructor</label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Instructor</option>
              {instructors.map((inst) => (
                <option key={inst.instructor_id} value={inst.instructor_id}>
                  {inst.firstname} {inst.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700">Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Program</option>
              {programDetails.map((prog) => (
                <option key={prog.program_details_id} value={prog.program_details_id}>
                  {prog.program_name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Level Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">Year Level</label>
            <select
              value={selectedYearLevel}
              onChange={(e) => {
                setSelectedYearLevel(e.target.value);
                // Clear selected section when year level changes to prompt re-selection
                setFormData(prev => ({ ...prev, section_id: '' }));
              }}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Year Level</option>
              {yearLevels.map((yl) => (
                <option key={yl.year_id} value={yl.year_id}>
                  {yl.year_level_name}
                </option>
              ))}
            </select>
          </div>

          {/*Semester Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                // Clear selected section when semester changes to prompt re-selection
                setFormData(prev => ({ ...prev, section_id: '' }));
              }}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.semester_id} value={sem.semester_id}>
                  {sem.semester_name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-blue-700">Section</label>
            <select
              name="section_id"
              value={formData.section_id}
              onChange={handleChange}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Section</option>
              {sections.length > 0 ? (
                sections.map((sec) => (
                  <option key={sec.section_id} value={sec.section_id}>
                    {sec.section_name} - {sec.course_code} ({sec.course_name})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {selectedYearLevel && selectedSemester ? "No sections found for selected Year Level and Semester" : "Please select Year Level and Semester first"}
                </option>
              )}
            </select>
          </div>

          {/* Buttons: Submit and Cancel */}
          <div className="md:col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin-students')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Update Student
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}