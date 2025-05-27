import React, { useState, useEffect } from 'react';
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
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    const fetchDropdowns = axios.all([
      axios.get('http://localhost/ustp-student-attendance-system/admin_backend/instructor_dropdown.php'),
      axios.get('http://localhost/ustp-student-attendance-system/admin_backend/section_dropdown.php'),
      axios.get('http://localhost/ustp-student-attendance-system/admin_backend/pd_dropdown.php'),
    ]);

    const fetchStudent = axios.get(
      `http://localhost/ustp-student-attendance/admin_backend/student_get_api.php?student_id=${student_id}`
    );

    Promise.all([fetchDropdowns, fetchStudent])
      .then(([[instRes, secRes, progRes], studentRes]) => {
        setInstructors(instRes.data);
        setSections(secRes.data);
        setProgramDetails(progRes.data);

        const student = studentRes.data;
        setFormData({
          firstname: student.firstname || '',
          middlename: student.middlename || '',
          lastname: student.lastname || '',
          date_of_birth: student.date_of_birth || '',
          contact_number: student.contact_number || '',
          email: student.email || '',
          password: '',
          street: student.street || '',
          city: student.city || '',
          province: student.province || '',
          zipcode: student.zipcode || '',
          country: student.country || '',
          section_id: student.section_id || '',
        });

        setSelectedInstructor(student.instructor_id || '');
        setSelectedProgram(student.program_details_id || '');
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        alert('Failed to load student or dropdown data.');
        navigate('/admin-students');
      });
  }, [student_id, navigate]);

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
        `http://localhost/ustp-student-attendance-system/admin_backend/student_update_api.php?student_id=${student_id}`,
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
      console.error('Failed to update student:', error);
      alert('Error updating student. Please check the console.');
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
