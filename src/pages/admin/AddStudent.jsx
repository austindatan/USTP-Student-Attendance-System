import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';

export default function AddStudent() {
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

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // fetch sections based on filters
  const fetchSections = useCallback(async (yearLevelId, semesterId) => {
    try {
      const params = {};
      if (yearLevelId) {
        params.year_level_id = yearLevelId;
      }
      if (semesterId) {
        params.semester_id = semesterId;
      }
      const secRes = await axios.get('http://localhost/ustp-student-attendance/admin_backend/section_dropdown.php', { params });
      setSections(secRes.data);

      if (formData.section_id && !secRes.data.some(sec => sec.section_id === formData.section_id)) {
          setFormData(prev => ({ ...prev, section_id: '' }));
      }
    } catch (error) {
      console.error('Error fetching filtered sections:', error);
      alert('Failed to load sections. Please try again.');
    }
  }, [formData.section_id]);

  // Initial data fetching for all dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, progRes, yearRes, semRes] = await Promise.all([
          axios.get('http://localhost/ustp-student-attendance/admin_backend/instructor_dropdown.php'),
          axios.get('http://localhost/ustp-student-attendance/admin_backend/pd_dropdown.php'),
          axios.get('http://localhost/ustp-student-attendance/admin_backend/get_year_levels.php'),
          axios.get('http://localhost/ustp-student-attendance/admin_backend/get_semesters.php'),
        ]);
        setInstructors(instRes.data);
        setProgramDetails(progRes.data);
        setYearLevels(yearRes.data);
        setSemesters(semRes.data);

        fetchSections('', '');

      } catch (error) {
        console.error('Error fetching initial dropdown data:', error);
        alert('Failed to load necessary data for dropdowns. Please try again.');
      }
    };
    fetchData();
  }, [fetchSections]);

  useEffect(() => {
    fetchSections(selectedYearLevel, selectedSemester);
  }, [selectedYearLevel, selectedSemester, fetchSections]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleResetForm = () => {
    setFormData({
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
    setImageFile(null);
    setSelectedInstructor('');
    setSelectedProgram('');
    setSelectedYearLevel('');
    setSelectedSemester('');
  };


  const handleCancel = () => {
    handleResetForm();
    navigate('/admin-students');
  };


  const handleOpenAddStudentModal = (e) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.date_of_birth ||
      !formData.contact_number ||
      !formData.email ||
      !formData.password ||
      !selectedInstructor ||
      !selectedProgram ||
      !selectedYearLevel || 
      !selectedSemester || 
      !formData.section_id
    ) {
      alert('Please fill in all required fields (First Name, Last Name, Date of Birth, Contact, Email, Password, Instructor, Program, Year Level, Semester, Section).');
      return;
    }
    setIsAddStudentModalOpen(true);
  };

  const handleConfirmAddStudent = async () => {
    setIsLoading(true);
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    submissionData.append('instructor_id', selectedInstructor);
    submissionData.append('program_details_id', selectedProgram);
    if (imageFile) submissionData.append('image', imageFile);

    try {
      const res = await axios.post(
        'http://localhost/ustp-student-attendance/admin_backend/student_add_api.php',
        submissionData
      );
      alert(res.data.message || 'Student added successfully!');
      setIsAddStudentModalOpen(false);
      handleResetForm();
      navigate('/admin-students');
    } catch (error) {
      console.error('Failed to add student:', error.response?.data || error.message);
      alert(`Error adding student: ${error.response?.data?.message || 'Please check the console for details.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };

  return (
    <div
      className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex"
      style={{ overflowY: 'auto' }}
    >
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
        {/* Header Container */}
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative flex items-center"
          style={{
            backgroundImage: "url('/assets/teacher_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Add New Student</h1>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleOpenAddStudentModal}
          className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4"
          encType="multipart/form-data"
        >
          {/* Student Inputs */}
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
                required={['firstname', 'lastname', 'date_of_birth', 'contact_number', 'email', 'password'].includes(name)}
                className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          ))}

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          {/* Instructor Dropdown */}
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

          {/* Program Dropdown */}
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
                setFormData(prev => ({ ...prev, section_id: '' })); // Reset section when year level changes
              }}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Year Level</option>
              {yearLevels.map((yl) => (
                <option key={yl.year_id} value={yl.year_id}> {/* Changed from yl.id to yl.year_id */}
                  {yl.year_level_name} {/* Changed from yl.year_level to yl.year_level_name */}
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
                setFormData(prev => ({ ...prev, section_id: '' })); // Reset section when semester changes
              }}
              required
              className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.semester_id} value={sem.semester_id}> {/* Changed from sem.id to sem.semester_id */}
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

          {/* Buttons at bottom right */}
          <div className="md:col-span-2 flex justify-end items-center space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Save Student
            </button>
          </div>
        </form>
      </section>

      {/*Confirmation Modal */}
      <ConfirmationModal
        isOpen={isAddStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        onConfirm={handleConfirmAddStudent}
        title="Confirm Student Addition"
        message={`Are you sure you want to add ${formData.firstname} ${formData.lastname} as a new student?`}
        confirmText="Add Student"
        loading={isLoading}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
}