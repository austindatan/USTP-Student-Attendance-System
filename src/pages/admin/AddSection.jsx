import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';

export default function AddSection() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_name: '',
    course_id: '',
    schedule_day: '',
    start_time: '',
    end_time: '',
    year_level_id: '', // Changed to store ID
    semester_id: '',   // Changed to store ID
  });

  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]); // New state for year levels
  const [semesters, setSemesters] = useState([]);   // New state for semesters

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState('');

  const [loadingYearLevels, setLoadingYearLevels] = useState(true); // New loading state
  const [errorYearLevels, setErrorYearLevels] = useState('');     // New error state

  const [loadingSemesters, setLoadingSemesters] = useState(true);   // New loading state
  const [errorSemesters, setErrorSemesters] = useState('');       // New error state

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Courses
  useEffect(() => {
    axios
      .get('http://localhost/ustp-student-attendance/admin_backend/get_course.php')
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
      .get('http://localhost/ustp-student-attendance/admin_backend/get_year_levels.php')
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
      .get('http://localhost/ustp-student-attendance/admin_backend/get_semesters.php')
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenAddSectionModal = (e) => {
    e.preventDefault();

    if (
      !formData.section_name ||
      !formData.course_id ||
      !formData.schedule_day ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.year_level_id || // Validate the ID
      !formData.semester_id      // Validate the ID
    ) {
      alert('Please fill in all required fields (Section Name, Course, Schedule Day, Start Time, End Time, Year Level, Semester).');
      return;
    }
    setIsAddSectionModalOpen(true);
  };

  const handleConfirmAddSection = async () => {
    setIsLoading(true);

    // Convert IDs to integers for database
    const submitData = {
      ...formData,
      course_id: parseInt(formData.course_id, 10),
      year_level_id: parseInt(formData.year_level_id, 10),
      semester_id: parseInt(formData.semester_id, 10),
    };

    try {
      const res = await axios.post(
        'http://localhost/ustp-student-attendance/admin_backend/section_add.php',
        JSON.stringify(submitData),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.data.success) {
        alert(res.data.message || 'Section added successfully!');
        setIsAddSectionModalOpen(false);

        setFormData({
          section_name: '',
          course_id: '',
          schedule_day: '',
          start_time: '',
          end_time: '',
          year_level_id: '',
          semester_id: '',
        });
        navigate('/admin-sections');
      } else {
        alert(res.data.message || 'Failed to add section.');
      }
    } catch (err) {
      console.error('An error occurred:', err);
      alert('An error occurred while adding the section.');
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
          <h1 className="text-2xl text-blue-700 font-bold">Add New Section</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleOpenAddSectionModal} className="grid grid-cols-1 md:grid-cols-2 gap-6">


            <div>
              <label className="block text-sm font-semibold text-gray-700">Section Name</label>
              <input
                type="text"
                name="section_name"
                value={formData.section_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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

            {/* Year Level Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Year Level</label>
              {loadingYearLevels ? (
                <p className="text-gray-500 mt-2">Loading year levels...</p>
              ) : errorYearLevels ? (
                <p className="text-red-500 mt-2">{errorYearLevels}</p>
              ) : (
                <select
                  name="year_level_id" // Use the ID here
                  value={formData.year_level_id}
                  onChange={handleChange}
                  required
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

            {/* Semester Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Semester</label>
              {loadingSemesters ? (
                <p className="text-gray-500 mt-2">Loading semesters...</p>
              ) : errorSemesters ? (
                <p className="text-red-500 mt-2">{errorSemesters}</p>
              ) : (
                <select
                  name="semester_id" // Use the ID here
                  value={formData.semester_id}
                  onChange={handleChange}
                  required
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
                Add Section
              </button>
            </div>

          </form>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isAddSectionModalOpen}
        onClose={handleCloseAddSectionModal}
        onConfirm={handleConfirmAddSection}
        title="Confirm Section Addition"
        message={`Are you sure you want to add section "${formData.section_name}" for the selected course and schedule?`}
        confirmText="Add Section"
        loading={isLoading}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
}