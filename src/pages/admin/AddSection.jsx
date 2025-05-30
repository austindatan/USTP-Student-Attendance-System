import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';

export default function AddSection() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_name: '',    // Used for new section
    section_id: '',      // Used for existing section (ID from dropdown)
    course_id: '',
    schedule_day: '',
    start_time: '',
    end_time: '',
    year_level_id: '',   // Only relevant for new section
    semester_id: '',     // Only relevant for new section
  });

  // State to determine if adding a new section or linking to an existing one
  const [sectionCreationMode, setSectionCreationMode] = useState('new'); // 'new' or 'existing'

  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [existingSections, setExistingSections] = useState([]); // New state for existing sections

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState('');

  const [loadingYearLevels, setLoadingYearLevels] = useState(true);
  const [errorYearLevels, setErrorYearLevels] = useState('');

  const [loadingSemesters, setLoadingSemesters] = useState(true);
  const [errorSemesters, setErrorSemesters] = useState('');

  const [loadingExistingSections, setLoadingExistingSections] = useState(true); // New loading state
  const [errorExistingSections, setErrorExistingSections] = useState('');     // New error state

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Courses
  useEffect(() => {
    axios
      .get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_course.php')
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.courses);
          setErrorCourses(null);
        } else {
          setErrorCourses('Failed to fetch courses: ' + (res.data.message || 'Unknown error'));
        }
        setLoadingCourses(false);
      })
      .catch((err) => {
        console.error('Axios error fetching courses:', err);
        setErrorCourses('Error loading courses: ' + (err.message || 'Network error'));
        setLoadingCourses(false);
      });
  }, []);

  // Fetch Year Levels
  useEffect(() => {
    axios
      .get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_year_levels.php')
      .then((res) => {
        if (res.data.success) {
          setYearLevels(res.data.year_levels);
          setErrorYearLevels(null);
        } else {
          setErrorYearLevels('Failed to fetch year levels: ' + (res.data.message || 'Unknown error'));
        }
        setLoadingYearLevels(false);
      })
      .catch((err) => {
        console.error('Axios error fetching year levels:', err);
        setErrorYearLevels('Error loading year levels: ' + (err.message || 'Network error'));
        setLoadingYearLevels(false);
      });
  }, []);

  // Fetch Semesters
  useEffect(() => {
    axios
      .get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_semesters.php')
      .then((res) => {
        if (res.data.success) {
          setSemesters(res.data.semesters);
          setErrorSemesters(null);
        } else {
          setErrorSemesters('Failed to fetch semesters: ' + (res.data.message || 'Unknown error'));
        }
        setLoadingSemesters(false);
      })
      .catch((err) => {
        console.error('Axios error fetching semesters:', err);
        setErrorSemesters('Error loading semesters: ' + (err.message || 'Network error'));
        setLoadingSemesters(false);
      });
  }, []);

  // Fetch Existing Sections (NEW)
  useEffect(() => {
    axios
      .get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_sections_dropdown.php')
      .then((res) => {
        if (res.data.success) {
          setExistingSections(res.data.sections);
          setErrorExistingSections(null);
        } else {
          setErrorExistingSections('Failed to fetch existing sections: ' + (res.data.message || 'Unknown error'));
        }
        setLoadingExistingSections(false);
      })
      .catch((err) => {
        console.error('Axios error fetching existing sections:', err);
        setErrorExistingSections('Error loading existing sections: ' + (err.message || 'Network error'));
        setLoadingExistingSections(false);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSectionModeChange = (mode) => {
    setSectionCreationMode(mode);
    // Clear relevant fields when switching modes
    setFormData((prevData) => ({
      ...prevData,
      section_name: mode === 'existing' ? '' : prevData.section_name, // Clear name if switching to existing
      section_id: mode === 'new' ? '' : prevData.section_id,         // Clear ID if switching to new
      year_level_id: mode === 'existing' ? '' : prevData.year_level_id, // Clear if linking to existing
      semester_id: mode === 'existing' ? '' : prevData.semester_id,   // Clear if linking to existing
    }));
  };

  const handleOpenAddSectionModal = (e) => {
    e.preventDefault();

    // Basic validation based on the mode
    if (sectionCreationMode === 'new') {
      if (
        !formData.section_name ||
        !formData.course_id ||
        !formData.schedule_day ||
        !formData.start_time ||
        !formData.end_time ||
        !formData.year_level_id ||
        !formData.semester_id
      ) {
        alert('Please fill in all required fields for a new section (Section Name, Course, Schedule Day, Start Time, End Time, Year Level, Semester).');
        return;
      }
    } else { // 'existing' mode
      if (
        !formData.section_id ||
        !formData.course_id ||
        !formData.schedule_day ||
        !formData.start_time ||
        !formData.end_time
      ) {
        alert('Please select an existing section and fill in all required fields (Existing Section, Course, Schedule Day, Start Time, End Time).');
        return;
      }
    }

    setIsAddSectionModalOpen(true);
  };

  const handleConfirmAddSection = async () => {
    setIsLoading(true);

    let submitData = {};
    let apiUrl = '';

    if (sectionCreationMode === 'new') {
      // Data for creating a new section (insert into 'section' and 'section_courses')
      submitData = {
        section_name: formData.section_name,
        course_id: parseInt(formData.course_id, 10),
        schedule_day: formData.schedule_day,
        start_time: formData.start_time,
        end_time: formData.end_time,
        year_level_id: parseInt(formData.year_level_id, 10),
        semester_id: parseInt(formData.semester_id, 10),
      };
      apiUrl = 'http://localhost/USTP-Student-Attendance-System/admin_backend/section_add.php';
    } else {
      // Data for linking to an existing section (insert into 'section_courses' only)
      submitData = {
        section_id: parseInt(formData.section_id, 10), // Use section_id
        course_id: parseInt(formData.course_id, 10),
        schedule_day: formData.schedule_day,
        start_time: formData.start_time,
        end_time: formData.end_time,
        // No year_level_id or semester_id needed here
      };
      apiUrl = 'http://localhost/USTP-Student-Attendance-System/admin_backend/link_section_to_course.php';
    }

    try {
      const res = await axios.post(
        apiUrl,
        JSON.stringify(submitData),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.data.success) {
        alert(res.data.message || 'Operation successful!');
        setIsAddSectionModalOpen(false);

        // Reset form data after successful submission
        setFormData({
          section_name: '',
          section_id: '',
          course_id: '',
          schedule_day: '',
          start_time: '',
          end_time: '',
          year_level_id: '',
          semester_id: '',
        });
        setSectionCreationMode('new'); // Reset to default mode
        navigate('/admin-sections');
      } else {
        alert(res.data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error('An error occurred:', err);
      alert('An error occurred during the operation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAddSectionModal = () => {
    setIsAddSectionModalOpen(false);
  };

  const handleCancel = () => {
    navigate('/admin-sections');
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll" style={{ backgroundImage: "url('/assets/section_bg.png')" }}>
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-0 max-w-5xl mx-auto">

        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/assets/section_vector.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Add New Section or Link to Existing</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleOpenAddSectionModal} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Section Creation Mode Selection */}
            <div className="md:col-span-2 mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Section Option:</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sectionMode"
                    value="new"
                    checked={sectionCreationMode === 'new'}
                    onChange={() => handleSectionModeChange('new')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Create New Section</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sectionMode"
                    value="existing"
                    checked={sectionCreationMode === 'existing'}
                    onChange={() => handleSectionModeChange('existing')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Link to Existing Section</span>
                </label>
              </div>
            </div>

            {/* Conditional Section Name Input or Section ID Dropdown */}
            {sectionCreationMode === 'new' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Section Name</label>
                <input
                  type="text"
                  name="section_name"
                  value={formData.section_name}
                  onChange={handleChange}
                  required={sectionCreationMode === 'new'}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Existing Section</label>
                {loadingExistingSections ? (
                  <p className="text-gray-500 mt-2">Loading sections...</p>
                ) : errorExistingSections ? (
                  <p className="text-red-500 mt-2">{errorExistingSections}</p>
                ) : (
                  <select
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    required={sectionCreationMode === 'existing'}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an Existing Section</option>
                    {existingSections.map((section) => (
                      <option key={section.section_id} value={section.section_id}>
                        {section.section_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Course Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Course</label>
              {loadingCourses ? (
                <p className="text-gray-500 mt-2">Loading courses...</p>
              ) : errorCourses ? (
                <p className="text-red-500 mt-2">{errorCourses}</p>
              ) : (
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_code}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Schedule Day */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Schedule Day</label>
              <select
                name="schedule_day"
                value={formData.schedule_day}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a day</option>
                <option value="Monday & Tuesday">Monday & Tuesday</option>
                <option value="Monday & Wednesday">Monday & Wednesday</option>
                <option value="Monday & Thursday">Monday & Thursday</option>
                <option value="Monday & Friday">Monday & Friday</option>
                <option value="Monday & Saturday">Monday & Saturday</option>
                <option value="Tuesday & Wednesday">Tuesday & Wednesday</option>
                <option value="Tuesday & Thursday">Tuesday & Thursday</option>
                <option value="Tuesday & Friday">Tuesday & Friday</option>
                <option value="Tuesday & Saturday">Tuesday & Saturday</option>
                <option value="Wednesday & Thursday">Wednesday & Thursday</option>
                <option value="Wednesday & Friday">Wednesday & Friday</option>
                <option value="Wednesday & Saturday">Wednesday & Saturday</option>
                <option value="Thursday & Friday">Thursday & Friday</option>
                <option value="Thursday & Saturday">Thursday & Saturday</option>
                <option value="Friday & Saturday">Friday & Saturday</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">End Time</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Year Level Dropdown (Conditional) */}
            {sectionCreationMode === 'new' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Year Level</label>
                {loadingYearLevels ? (
                  <p className="text-gray-500 mt-2">Loading year levels...</p>
                ) : errorYearLevels ? (
                  <p className="text-red-500 mt-2">{errorYearLevels}</p>
                ) : (
                  <select
                    name="year_level_id"
                    value={formData.year_level_id}
                    onChange={handleChange}
                    required={sectionCreationMode === 'new'}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year Level</option>
                    {yearLevels.map((yl) => (
                      <option key={yl.year_id} value={yl.year_id}>
                        {yl.year_level_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Semester Dropdown (Conditional) */}
            {sectionCreationMode === 'new' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Semester</label>
                {loadingSemesters ? (
                  <p className="text-gray-500 mt-2">Loading semesters...</p>
                ) : errorSemesters ? (
                  <p className="text-red-500 mt-2">{errorSemesters}</p>
                ) : (
                  <select
                    name="semester_id"
                    value={formData.semester_id}
                    onChange={handleChange}
                    required={sectionCreationMode === 'new'}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem.semester_id} value={sem.semester_id}>
                        {sem.semester_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Buttons - full width below */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                {sectionCreationMode === 'new' ? 'Add Section' : 'Link Section to Course'}
              </button>
            </div>

          </form>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isAddSectionModalOpen}
        onClose={handleCloseAddSectionModal}
        onConfirm={handleConfirmAddSection}
        title={sectionCreationMode === 'new' ? "Confirm Section Addition" : "Confirm Section-Course Linkage"}
        message={
          sectionCreationMode === 'new'
            ? `Are you sure you want to add new section "${formData.section_name}" for the selected course and schedule?`
            : `Are you sure you want to link section "${formData.section_id ? existingSections.find(s => s.section_id === formData.section_id)?.section_name : ''}" to the selected course and schedule?`
        }
        confirmText={sectionCreationMode === 'new' ? "Add Section" : "Link Section"}
        loading={isLoading}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
}