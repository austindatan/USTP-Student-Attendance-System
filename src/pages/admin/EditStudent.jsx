import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';
import MessageModal from '../../components/MessageModal'; 

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
    });

    const [imageFile, setImageFile] = useState(null);
    const [studentAcademicDetails, setStudentAcademicDetails] = useState({
        program_details_id: '',
        year_level_id: '',
        semester_id: '',
    });

    const [academicDetailsLocked, setAcademicDetailsLocked] = useState(false);

    const [programDetails, setProgramDetails] = useState([]);
    const [yearLevels, setYearLevels] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [newEnrollmentSectionCourseId, setNewEnrollmentSectionCourseId] = useState('');

    const [cachedSections, setCachedSections] = useState({});

    const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalTitle, setMessageModalTitle] = useState('');
    const [messageModalMessage, setMessageModalMessage] = useState('');
    const [messageModalType, setMessageModalType] = useState('info'); 

    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

    const showMessageModal = useCallback((title, message, type = 'info') => {
        setMessageModalTitle(title);
        setMessageModalMessage(message);
        setMessageModalType(type);
        setIsMessageModalOpen(true);
    }, []); 

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessageModalTitle('');
        setMessageModalMessage('');
        setMessageModalType('info');
    };

    const fetchSections = useCallback(async (yearLevelId, semesterId) => {
        if (!yearLevelId || !semesterId) {
            return [];
        }
        const cacheKey = `${yearLevelId}-${semesterId}`;

        if (cachedSections[cacheKey]) {
            return cachedSections[cacheKey];
        }

        try {
            const params = { year_level_id: yearLevelId, semester_id: semesterId };
            const secRes = await axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/section_dropdown.php', { params });
            const fetchedSections = secRes.data;
            setCachedSections(prevCached => ({ ...prevCached, [cacheKey]: fetchedSections }));
            return fetchedSections;
        } catch (error) {
            console.error(`Error fetching sections for Year ${yearLevelId}, Semester ${semesterId}:`, error);
            showMessageModal('Error', `Failed to fetch sections for academic details. Please try again.`, 'error');
            return [];
        }
    }, [showMessageModal]); 

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingInitialData(true);
            try {
                const [progRes, yearRes, semRes, studentRes] = await Promise.all([
                    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/pd_dropdown.php'),
                    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_year_levels.php'),
                    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_semesters.php'),
                    axios.get(`http://localhost/USTP-Student-Attendance-System/admin_backend/student_get_api.php?student_id=${student_id}`),
                ]);

                setProgramDetails(progRes.data);
                setYearLevels(yearRes.data.year_levels || []);
                setSemesters(semRes.data.semesters || []);

                const studentData = studentRes.data;

                setFormData({
                    firstname: studentData.firstname || '',
                    middlename: studentData.middlename || '',
                    lastname: studentData.lastname || '',
                    date_of_birth: studentData.date_of_birth || '',
                    contact_number: studentData.contact_number || '',
                    email: studentData.email || '',
                    password: '', 
                    street: studentData.street || '',
                    city: studentData.city || '',
                    province: studentData.province || '',
                    zipcode: studentData.zipcode || '',
                    country: studentData.country || '',
                });

                const newSectionsCache = {};
                const initialEnrollments = await Promise.all(
                    (studentData.enrollments || []).map(async (enrollment) => {
                        if (enrollment.year_level_id && enrollment.semester_id) {
                            const cacheKey = `${enrollment.year_level_id}-${enrollment.semester_id}`;
                            if (!newSectionsCache[cacheKey]) {
                                try {
                                    const res = await axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/section_dropdown.php', {
                                        params: { year_level_id: enrollment.year_level_id, semester_id: enrollment.semester_id }
                                    });
                                    newSectionsCache[cacheKey] = res.data;
                                } catch (error) {
                                    console.error(`Error fetching sections for Year ${enrollment.year_level_id}, Semester ${enrollment.semester_id}:`, error);
                                    newSectionsCache[cacheKey] = [];
                                }
                            }
                        }
                        return {
                            ...enrollment,
                            isNew: false,
                            year_level_id: enrollment.year_level_id || '',
                            semester_id: enrollment.semester_id || '',
                            section_course_id: enrollment.section_course_id || '',
                        };
                    })
                );

                setCachedSections(newSectionsCache);
                setEnrollments(initialEnrollments);

                if (initialEnrollments.length > 0) {
                    const firstEnrollment = initialEnrollments[0];
                    setStudentAcademicDetails({
                        program_details_id: firstEnrollment.program_details_id,
                        year_level_id: firstEnrollment.year_level_id,
                        semester_id: firstEnrollment.semester_id,
                    });
                    setAcademicDetailsLocked(true);
                }


            } catch (err) {
                console.error('Failed to fetch data:', err);
                showMessageModal('Error', 'Failed to load student or dropdown data. Please try again later.', 'error');
                navigate('/admin-students');
            } finally {
                setIsLoadingInitialData(false);
            }
        };

        fetchData();
    }, [student_id, navigate, showMessageModal]); 

    useEffect(() => {
        const { year_level_id, semester_id } = studentAcademicDetails;
        if (year_level_id && semester_id) {
            fetchSections(year_level_id, semester_id);
        }
    }, [studentAcademicDetails.year_level_id, studentAcademicDetails.semester_id, fetchSections]);

    const handleStudentDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleEnrollmentChange = useCallback(async (index, field, value) => {
        setEnrollments(prevEnrollments => {
            const updatedEnrollments = [...prevEnrollments];
            const currentEnrollment = { ...updatedEnrollments[index] };

            currentEnrollment[field] = value;

            if (
                currentEnrollment.student_details_id &&
                field === 'section_course_id'
            ) {
                currentEnrollment.isNew = true;
                delete currentEnrollment.student_details_id;
            }

            updatedEnrollments[index] = currentEnrollment;
            return updatedEnrollments;
        });
    }, []);

    const handleStudentAcademicDetailsChange = (e) => {
        const { name, value } = e.target;
        const updatedDetails = { ...studentAcademicDetails, [name]: value };
        setStudentAcademicDetails(updatedDetails);

        if (updatedDetails.program_details_id && updatedDetails.year_level_id && updatedDetails.semester_id) {
            setAcademicDetailsLocked(true);
        }
    };

    const addEnrollment = () => {
        if (
            !studentAcademicDetails.program_details_id ||
            !studentAcademicDetails.year_level_id ||
            !studentAcademicDetails.semester_id
        ) {
            showMessageModal(
                'Missing Details',
                'Please select Program, Year Level, and Semester in the "Student\'s Academic Details" section first.',
                'error'
            );
            return;
        }

        if (!newEnrollmentSectionCourseId) {
            showMessageModal('Missing Selection', 'Please select a Class Section to add.', 'error');
            return;
        }

        const newFullEnrollment = {
            program_details_id: studentAcademicDetails.program_details_id,
            year_level_id: studentAcademicDetails.year_level_id,
            semester_id: studentAcademicDetails.semester_id,
            section_course_id: newEnrollmentSectionCourseId,
            isNew: true,
        };
        const isDuplicate = enrollments.some(existing =>
            String(existing.section_course_id) === String(newFullEnrollment.section_course_id) &&
            String(existing.program_details_id) === String(newFullEnrollment.program_details_id) &&
            String(existing.year_level_id) === String(newFullEnrollment.year_level_id) &&
            String(existing.semester_id) === String(newFullEnrollment.semester_id)
        );
        if (isDuplicate) {
            showMessageModal(
                'Duplicate Class',
                'This class (combination of program, year, semester, and section) has already been added.',
                'error'
            );
            return;
        }

        setEnrollments(prevEnrollments => [...prevEnrollments, newFullEnrollment]);
        setNewEnrollmentSectionCourseId('');
    };

    const removeEnrollment = (index) => {
        setEnrollments(prev => prev.filter((_, i) => i !== index));
    };

    const handleResetAcademicDetails = () => {
        setStudentAcademicDetails({
            program_details_id: '',
            year_level_id: '',
            semester_id: '',
        });
        setAcademicDetailsLocked(false);
        setNewEnrollmentSectionCourseId('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.date_of_birth || !formData.contact_number) {
            showMessageModal(
                'Missing Information',
                'Please fill in all required personal information fields: First Name, Last Name, Email, Date of Birth, and Contact Number.',
                'info'
            );
            return;
        }

        if (enrollments.length === 0) {
            showMessageModal('Missing Enrollment', 'A student must be enrolled in at least one class.', 'error');
            return;
        }

        const hasInvalidEnrollment = enrollments.some(enrollment => {
            return !enrollment.section_course_id;
        });
        if (hasInvalidEnrollment) {
            showMessageModal(
                'Invalid Enrollment',
                'Please ensure all existing enrollment fields (Class Section) are selected for every enrollment.',
                'info'
            );
            return;
        }


        setIsEditStudentModalOpen(true); 
    };

    const handleConfirmUpdate = async () => {
        setIsSaving(true);
        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                submissionData.append(key, value);
            }
        });
        if (imageFile) {
            if (imageFile instanceof File) {
                submissionData.append('image', imageFile);
            }
        } else {
             submissionData.append('clear_image', 'true');
        }

        const enrollmentsToSend = enrollments.map(enrollment => ({
            student_details_id: enrollment.student_details_id,
            program_details_id: enrollment.program_details_id,
            year_level_id: enrollment.year_level_id,
            semester_id: enrollment.semester_id,
            section_course_id: enrollment.section_course_id,
            isNew: enrollment.isNew,
        }));
        submissionData.append('enrollments', JSON.stringify(enrollmentsToSend));

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
            if (res.data.success) {
                setIsEditStudentModalOpen(false);
                showMessageModal('Success', 'Student details updated successfully!', 'success');
                navigate('/admin-students');
            } else {
                showMessageModal('Update Failed', res.data.message || 'Update failed.', 'error');
                setIsEditStudentModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update student:', error.response?.data || error.message);
            showMessageModal(
                'Error',
                `Error updating student: ${error.response?.data?.message || 'Please check the console for details.'}`,
                'error'
            );
            setIsEditStudentModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseEditStudentModal = () => {
        setIsEditStudentModalOpen(false);
    };

    const studentFullName = `${formData.firstname} ${formData.lastname}`;

    if (isLoadingInitialData) {
        return <div className="text-center mt-10">Loading student data...</div>;
    }

    const isAcademicDetailsSelectedForNew = studentAcademicDetails.program_details_id &&
        studentAcademicDetails.year_level_id &&
        studentAcademicDetails.semester_id;

    const currentSectionsForNewEnrollment = isAcademicDetailsSelectedForNew
        ? (cachedSections[`${studentAcademicDetails.year_level_id}-${studentAcademicDetails.semester_id}`] || [])
        : [];

    return (
        <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
            <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 max-w-5xl mx-auto">
                <div
                    className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
                    style={{
                        backgroundImage: "url('/assets/teacher_vector.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right',
                        backgroundSize: 'contain',
                    }}
                >
                    <h1 className="text-2xl text-blue-700 font-bold">Edit Student</h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4"
                    encType="multipart/form-data"
                >
                    {/* Student Personal Information Inputs */}
                    <h2 className="md:col-span-2 text-xl font-bold text-blue-700 mb-2">Personal Information</h2>
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
                                onChange={handleStudentDataChange}
                                required={['firstname', 'lastname', 'date_of_birth', 'contact_number', 'email'].includes(name)}
                                className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
                                autoComplete={name === 'password' ? 'new-password' : undefined}
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

                    {/* Student Overall Academic Details */}
                    <div className="md:col-span-2 mt-6 border-t pt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4 flex justify-between items-center">
                            Student's Academic Details for New Enrollments
                            {academicDetailsLocked && (
                                <button
                                    type="button"
                                    onClick={handleResetAcademicDetails}
                                    className="text-sm text-blue-600 hover:text-blue-800 underline ml-4"
                                >
                                    Reset
                                </button>
                            )}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Program */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Program</label>
                                <select
                                    name="program_details_id"
                                    value={studentAcademicDetails.program_details_id}
                                    onChange={handleStudentAcademicDetailsChange}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={academicDetailsLocked}
                                >
                                    <option value="">Select Program</option>
                                    {programDetails.map((prog) => (
                                        <option key={prog.program_details_id} value={prog.program_details_id}>
                                            {prog.program_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Year Level */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Year Level</label>
                                <select
                                    name="year_level_id"
                                    value={studentAcademicDetails.year_level_id}
                                    onChange={handleStudentAcademicDetailsChange}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={academicDetailsLocked}
                                >
                                    <option value="">Select Year Level</option>
                                    {Array.isArray(yearLevels) && yearLevels.map((yl) => (
                                        <option key={yl.year_id} value={yl.year_id}>
                                            {yl.year_level_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Semester</label>
                                <select
                                    name="semester_id"
                                    value={studentAcademicDetails.semester_id}
                                    onChange={handleStudentAcademicDetailsChange}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={academicDetailsLocked}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem.semester_id} value={sem.semester_id}>
                                            {sem.semester_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {academicDetailsLocked && (
                            <p className="text-sm text-gray-600 mt-2">
                                * Program, Year Level, and Semester are locked. Click "Reset" to change.
                            </p>
                        )}
                    </div>

                    {/* Dynamic Enrollments Section */}
                    <div className="md:col-span-2 mt-6 border-t pt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Existing Student Enrollments (Classes)</h2>
                        {enrollments.length === 0 && (
                            <p className="text-gray-600 mb-4">No enrollments added yet. Add a new one below.</p>
                        )}
                        {/* Display existing enrollments */}
                        {enrollments.map((enrollment, index) => {
                            // Find the section details for display
                            const sectionForDisplay = (cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`] || [])
                                .find(sec => String(sec.section_course_id) === String(enrollment.section_course_id));

                            return (
                                <div key={enrollment.student_details_id || `new-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-blue-50 mt-6">

                                    {/* Section (Read-Only) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">Section</label>
                                        <p className="text-black w-full px-3 py-1 mt-1 border border-gray-300 rounded bg-gray-100">
                                            {sectionForDisplay ? `${sectionForDisplay.section_name} - ${sectionForDisplay.course_code} (${sectionForDisplay.course_name})` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="col-span-1 md:col-span-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeEnrollment(index)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                                        >
                                            Remove Enrollment
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New Enrollment Section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-blue-50 mt-6">
                            <h3 className="col-span-full text-lg font-semibold text-blue-700 mb-2">Add New Class Enrollment</h3>
                            {/* Display selected academic details for context */}
                            <div className="col-span-full">
                                <p className="text-sm text-gray-700">
                                    Adding class for:
                                    <span className="font-medium ml-1">
                                        {programDetails.find(p => String(p.program_details_id) === String(studentAcademicDetails.program_details_id))?.program_name || 'N/A'}
                                    </span>,
                                    <span className="font-medium ml-1">
                                        Year {yearLevels.find(yl => String(yl.year_id) === String(studentAcademicDetails.year_level_id))?.year_level_name || 'N/A'}
                                    </span>,
                                    <span className="font-medium ml-1">
                                        Semester {semesters.find(s => String(s.semester_id) === String(studentAcademicDetails.semester_id))?.semester_name || 'N/A'}
                                    </span>
                                </p>
                                {!isAcademicDetailsSelectedForNew && (
                                    <p className="text-red-500 text-sm mt-1">Please select Program, Year Level, and Semester above to enable adding classes.</p>
                                )}
                            </div>

                            {/* Section/Course for new enrollment */}
                            <div className="md:col-span-3">
                                <label className="block text-sm font-semibold text-gray-700">Class Section</label>
                                <select
                                    value={newEnrollmentSectionCourseId}
                                    onChange={(e) => setNewEnrollmentSectionCourseId(e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isAcademicDetailsSelectedForNew}
                                >
                                    <option value="">Select Class Section</option>
                                    {currentSectionsForNewEnrollment.length > 0 ? (
                                        currentSectionsForNewEnrollment.map((sec) => (
                                            <option key={sec.section_course_id} value={sec.section_course_id}>
                                                {sec.section_name} - {sec.course_code} ({sec.course_name})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            {isAcademicDetailsSelectedForNew ? "No sections found" : "Select Year & Semester above"}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className="md:col-span-1 flex items-end">
                                <button
                                    type="button"
                                    onClick={addEnrollment}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                                    disabled={!isAcademicDetailsSelectedForNew}
                                >
                                    Add Enrollment
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 mt-6">
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

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isEditStudentModalOpen}
                onClose={handleCloseEditStudentModal}
                onConfirm={handleConfirmUpdate}
                title="Confirm Edit"
                message={`Are you sure you want to update the details and enrollments for "${studentFullName}"?`}
                confirmText="Update Student"
                loading={isSaving}
            />

            {/* Message Modal */}
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={closeMessageModal}
                title={messageModalTitle}
                message={messageModalMessage}
                type={messageModalType}
            />
        </div>
    );
}
