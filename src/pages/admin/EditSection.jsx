import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';

const EditSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_id: '',
    section_name: '',
    year_level_id: '',
    semester_id: '',
  });

  const [yearLevels, setYearLevels] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [loadingSection, setLoadingSection] = useState(true);
  const [loadingYearLevels, setLoadingYearLevels] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(true);

  const [errorSection, setErrorSection] = useState('');
  const [errorYearLevels, setErrorYearLevels] = useState('');
  const [errorSemesters, setErrorSemesters] = useState('');

  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch single section data
    axios
      .get(`http://localhost/ustp-student-attendance/admin_backend/get_single_section.php?section_id=${id}`)
      .then((res) => {
        if (res.data.success && res.data.section) {
          setFormData({
            section_id: id,
            section_name: res.data.section.section_name || '',
            year_level_id: res.data.section.year_level_id || '',
            semester_id: res.data.section.semester_id || '',
          });
          setErrorSection(null);
        } else {
          setErrorSection(res.data.message || 'Failed to load section data.');
          alert(res.data.message || 'Failed to load section data.');
          navigate('/admin-sections');
        }
        setLoadingSection(false);
      })
      .catch((err) => {
        console.error('Axios error fetching section data:', err);
        setErrorSection('Error fetching section data: ' + (err.message || 'Network error'));
        alert('Error fetching section data. Please try again.');
        navigate('/admin-sections');
        setLoadingSection(false);
      });

    // Fetch Year Levels
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

    // Fetch Semesters
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
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation before opening modal
    if (!formData.section_name.trim() || !formData.year_level_id || !formData.semester_id) {
      alert('Please fill in all required fields (Section Name, Year Level, and Semester).');
      return;
    }

    setIsEditSectionModalOpen(true); // Open confirmation modal
  };

  const handleConfirmUpdate = async () => {
    setIsSaving(true); // Start loading animation in modal
    try {
      const res = await axios.post(
        'http://localhost/ustp-student-attendance/admin_backend/update_section.php',
        JSON.stringify(formData), // Send formData as JSON
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (res.data.success) {
        alert(res.data.message || 'Section updated successfully!');
        setIsEditSectionModalOpen(false); // Close modal
        navigate('/admin-sections'); // Redirect to sections list
      } else {
        alert(res.data.message || 'Update failed.');
        setIsEditSectionModalOpen(false); // Close modal on failure
      }
    } catch (error) {
      console.error("Server error during update:", error);
      alert('An error occurred during the update. Please check the server logs.');
      setIsEditSectionModalOpen(false); // Close modal on error
    } finally {
      setIsSaving(false); // Stop loading animation
    }
  };

  const handleCloseEditSectionModal = () => {
    setIsEditSectionModalOpen(false);
  };

  const handleCancel = () => {
    navigate('/admin-sections');
  };

  const isLoading = loadingSection || loadingYearLevels || loadingSemesters;
  const hasError = errorSection || errorYearLevels || errorSemesters;

  if (isLoading) return <p className="text-center mt-10">Loading section details...</p>;
  if (hasError) return <p className="text-center mt-10 text-red-600">Error: {errorSection || errorYearLevels || errorSemesters}</p>;


  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll" style={{ backgroundImage: "url('/assets/section_bg.png')" }}>
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/assets/section_vector.png')", // Changed image path
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundSize: 'contain',
          }}
        >
          <h1 className="text-2xl text-blue-700 font-bold">Edit Section</h1>
        </div>

        <div className="bg-white shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="hidden" name="section_id" value={formData.section_id} />

            <div>
              <label className="block text-sm font-semibold text-gray-700">Section Name</label>
              <input
                type="text"
                name="section_name"
                value={formData.section_name}
                onChange={handleChange}
                required
                autoComplete="off"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  name="year_level_id"
                  value={formData.year_level_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  name="semester_id"
                  value={formData.semester_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="md:col-span-2 flex justify-end items-center gap-3">
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
                Update Section
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isEditSectionModalOpen}
        onClose={handleCloseEditSectionModal}
        onConfirm={handleConfirmUpdate}
        title="Confirm Edit"
        message={`Are you sure you want to update the section "${formData.section_name}"?`}
        confirmText="Update Section"
        loading={isSaving}
        confirmButtonClass="bg-blue-700 hover:bg-blue-800"
      />
    </div>
  );
};

export default EditSection;