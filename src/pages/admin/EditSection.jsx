import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal'; // Import ConfirmationModal

const EditSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section_id: '',
    section_name: '',
    semester_id: '',
    year_level_id: '',
  });

  const [semesters, setSemesters] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch single section data
        const sectionRes = await axios.get(`http://localhost/ustp-student-attendance/admin_backend/get_single_section.php?section_id=${id}`);
        if (sectionRes.data.success && sectionRes.data.section) {
          setFormData({
            section_id: id,
            section_name: sectionRes.data.section.section_name,
            semester_id: String(sectionRes.data.section.semester_id || ''),
            year_level_id: String(sectionRes.data.section.year_level_id || ''),
          });
        } else {
          alert(sectionRes.data.message || 'Failed to load section data.');
          navigate('/admin-sections');
          return;
        }

        // Fetch semesters data
        const semestersRes = await axios.get('http://localhost/ustp-student-attendance/admin_backend/get_semesters.php');
        if (semestersRes.data.success) {
          setSemesters(semestersRes.data.semesters);
        } else {
          console.warn("Failed to load semesters:", semestersRes.data.message);
        }

        // Fetch year levels data
        const yearLevelsRes = await axios.get('http://localhost/ustp-student-attendance/admin_backend/get_year_levels.php');
        if (yearLevelsRes.data.success) {
          setYearLevels(yearLevelsRes.data.year_levels);
        } else {
          console.warn("Failed to load year levels:", yearLevelsRes.data.message);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        alert('Error fetching section or related data.');
        navigate('/admin-sections');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.section_name || !formData.semester_id || !formData.year_level_id) {
      alert('Please fill in all required fields (Section Name, Semester, Year Level).');
      return;
    }

    setIsEditSectionModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await axios.post('http://localhost/ustp-student-attendance/admin_backend/update_section.php', formData);
      if (res.data.success) {
        setIsEditSectionModalOpen(false);
        navigate('/admin-sections');
      } else {
        alert(res.data.message || 'Update failed.');
        setIsEditSectionModalOpen(false);
      }
    } catch (error) {
      console.error("Server error during update:", error);
      alert('Server error during update.');
      setIsEditSectionModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseEditSectionModal = () => {
    setIsEditSectionModalOpen(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/teacher_vector.png')",
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

            <div>
              <label className="block text-sm font-semibold text-gray-700">Semester</label>
              <select
                name="semester_id"
                value={formData.semester_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.semester_id} value={String(semester.semester_id)}>
                    {semester.semester_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Year Level</label>
              <select
                name="year_level_id"
                value={formData.year_level_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Year Level</option>
                {yearLevels.map((yearLevel) => (
                  <option key={yearLevel.year_id} value={String(yearLevel.year_id)}> {/* Changed key and value to yearLevel.year_id */}
                    {yearLevel.year_level_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin-sections')}
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