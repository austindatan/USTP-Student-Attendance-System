import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    section_id: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [sections, setSections] = useState([]);
  const [programDetails, setProgramDetails] = useState([]);

  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/instructor_dropdown.php')
      .then(res => setInstructors(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/section_dropdown.php')
      .then(res => setSections(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/pd_dropdown.php')
      .then(res => setProgramDetails(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
submissionData.append("instructor_id", selectedInstructor);
submissionData.append("program_details_id", selectedProgram);
submissionData.append("section_id", formData.section_id);


    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const response = await axios.post("http://localhost/USTP-Student-Attendance-System/admin_backend/student_add_api.php", submissionData);
      alert(response.data.message || "Student added successfully!");
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Error adding student. Check the console for details.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Add New Student</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "firstname", label: "First Name", required: true },
            { name: "middlename", label: "Middle Name" },
            { name: "lastname", label: "Last Name", required: true },
            { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
            { name: "contact_number", label: "Contact Number", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Password", type: "password", required: true },
            { name: "street", label: "Street" },
            { name: "city", label: "City" },
            { name: "province", label: "Province" },
            { name: "zipcode", label: "Zipcode" },
            { name: "country", label: "Country" }
          ].map(({ name, label, type = "text", required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <hr className="my-6 border-t-2 border-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor:</label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                instructor.instructor_id && (
                  <option key={`instructor-${instructor.instructor_id}`} value={instructor.instructor_id}>
                    {instructor.firstname} {instructor.lastname}
                  </option>
                )
              ))}
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program:</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Program</option>
              {programDetails.map((program) => (
                program.program_details_id && (
                  <option key={`program-${program.program_details_id}`} value={program.program_details_id}>
                    {program.program_name}
                  </option>
                )
              ))}
            </select>

          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section:</label>
          <select
            name="section_id"
            value={formData.section_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              section.section_id && (
                <option key={`section-${section.section_id}`} value={section.section_id}>
                  {section.section_name}
                </option>
              )
            ))}
          </select>

        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-200"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}

