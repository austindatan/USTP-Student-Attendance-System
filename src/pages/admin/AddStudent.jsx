import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddStudent() {
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
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, secRes, progRes] = await Promise.all([
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/instructor_dropdown.php'),
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/section_dropdown.php'),
          axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/pd_dropdown.php'),
        ]);
        setInstructors(instRes.data);
        setSections(secRes.data);
        setProgramDetails(progRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchData();
  }, []);

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
    if (imageFile) submissionData.append('image', imageFile);

    try {
      const res = await axios.post(
        'http://localhost/USTP-Student-Attendance-System/admin_backend/student_add_api.php',
        submissionData
      );
      alert(res.data.message || 'Student added successfully!');
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Error adding student. Please check the console.');
    }
  };

  return (
    <div
      className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex"
      style={{ overflowY: 'auto' }}
    >
      <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">
        {/* Header Container */}
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/teacher_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Add New Student</h1>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
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
              {sections.map((sec) => (
                <option key={sec.section_id} value={sec.section_id}>
                  {sec.section_name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
            >
              Save Student
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
