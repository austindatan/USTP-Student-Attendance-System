import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal';
import MessageModal from '../../components/MessageModal'; 

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
    });
    const [imageFile, setImageFile] = useState(null);
    const [studentAcademicDetails, setStudentAcademicDetails] = useState({
        program_details_id: '',
        year_level_id: '',
        semester_id: '',
    });

    // To lock academic details once selected
    const [academicDetailsLocked, setAcademicDetailsLocked] = useState(false);

    // Dropdown options states
    const [programDetails, setProgramDetails] = useState([]);
    const [yearLevels, setYearLevels] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // State to manage multiple enrollments
    const [enrollments, setEnrollments] = useState([]); // Array to hold all enrollments for this new student

    // State for a *new* enrollment being added (only section_course_id needed now)
    const [newEnrollmentSectionCourseId, setNewEnrollmentSectionCourseId] = useState('');
    const [cachedSections, setCachedSections] = useState({});

    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loadingDropdowns, setLoadingDropdowns] = useState(true);
    const [errorDropdowns, setErrorDropdowns] = useState(null);

    // Message Modal states
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalTitle, setMessageModalTitle] = useState('');
    const [messageModalMessage, setMessageModalMessage] = useState('');
    const [messageModalType, setMessageModalType] = useState('info'); 

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
            showMessageModal('Error', `Failed to fetch classes for the selected academic period. Please try again.`, 'error');
            return [];
        }
    }, [showMessageModal]); 

    useEffect(() => {
        const fetchData = async () => {
            setLoadingDropdowns(true);
            setErrorDropdowns(null);
            try {
                const [progRes, yearRes, semRes] = await Promise.all([
                    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/pd_dropdown.php'),
                    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_year_levels.php'),
                    axios.get('http://localhost/USTP-Student-Attendance-System/admin_backend/get_semesters.php'),
                ]);

                setProgramDetails(progRes.data);

                if (yearRes.data.success) {
                    setYearLevels(yearRes.data.year_levels);
                } else {
                    console.warn("Failed to load year levels:", yearRes.data.message);
                    setErrorDropdowns(prevError => prevError ? prevError + ' Year levels failed.' : 'Year levels failed.');
                }

                if (semRes.data.success) {
                    setSemesters(semRes.data.semesters);
                } else {
                    console.warn("Failed to load semesters:", semRes.data.message);
                    setErrorDropdowns(prevError => prevError ? prevError + ' Semesters failed.' : 'Semesters failed.');
                }

            } catch (error) {
                console.error('Error fetching initial dropdown data:', error);
                setErrorDropdowns('Failed to load necessary data for dropdowns. Please check console.');
            } finally {
                setLoadingDropdowns(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const { year_level_id, semester_id } = studentAcademicDetails;
        if (year_level_id && semester_id) {
            fetchSections(year_level_id, semester_id);
        }
    }, [studentAcademicDetails.year_level_id, studentAcademicDetails.semester_id, fetchSections]);


    const handleStudentDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleStudentAcademicDetailsChange = (e) => {
        const { name, value } = e.target;
        const updatedDetails = { ...studentAcademicDetails, [name]: value };
        setStudentAcademicDetails(updatedDetails);

        if (updatedDetails.program_details_id && updatedDetails.year_level_id && updatedDetails.semester_id) {
            setAcademicDetailsLocked(true);
        }
    };

    // Handles image file selection
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const addEnrollment = () => {

        if (
            !studentAcademicDetails.program_details_id ||
            !studentAcademicDetails.year_level_id ||
            !studentAcademicDetails.semester_id
        ) {
            showMessageModal('Missing Academic Details', 'Please select Program, Year Level, and Semester for the student first.', 'error');
            return;
        }

        if (!newEnrollmentSectionCourseId) {
            showMessageModal('Missing Class Section', 'Please select a Class Section to add.', 'error');
            return;
        }

        const newFullEnrollment = {
            program_details_id: studentAcademicDetails.program_details_id,
            year_level_id: studentAcademicDetails.year_level_id,
            semester_id: studentAcademicDetails.semester_id,
            section_course_id: newEnrollmentSectionCourseId,
        };

        const isDuplicate = enrollments.some(existing =>
            String(existing.section_course_id) === String(newFullEnrollment.section_course_id) &&
            String(existing.program_details_id) === String(newFullEnrollment.program_details_id) &&
            String(existing.year_level_id) === String(newFullEnrollment.year_level_id) &&
            String(existing.semester_id) === String(newFullEnrollment.semester_id)
        );
        if (isDuplicate) {
            showMessageModal('Duplicate Class', 'This class (combination of program, year, semester, and section) has already been added.', 'error');
            return;
        }

        setEnrollments(prevEnrollments => [...prevEnrollments, newFullEnrollment]);
        setNewEnrollmentSectionCourseId('');
    };

    const removeEnrollment = (indexToRemove) => {
        setEnrollments(prevEnrollments => prevEnrollments.filter((_, index) => index !== indexToRemove));

    };

    const handleResetAcademicDetails = () => {
        setStudentAcademicDetails({
            program_details_id: '',
            year_level_id: '',
            semester_id: '',
        });
        setAcademicDetailsLocked(false); // Unlock the dropdowns
        setEnrollments([]); // Clear all added enrollments, as they depend on these details
        setNewEnrollmentSectionCourseId(''); // Clear the pending section selection
        setCachedSections({}); // Clear section cache as it depends on academic details
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
        });
        setImageFile(null);
        handleResetAcademicDetails();
    };

    const handleCancel = () => {
        handleResetForm();
        navigate('/admin-students');
    };

    const handleOpenAddStudentModal = (e) => {
        e.preventDefault();
        // Validate main student personal info
        if (
            !formData.firstname ||
            !formData.lastname ||
            !formData.date_of_birth ||
            !formData.contact_number ||
            !formData.email ||
            !formData.password
        ) {
            showMessageModal('Missing Information', 'Please fill in all required student personal information fields.', 'error');
            return;
        }

        // Validate overall academic details are selected
        if (
            !studentAcademicDetails.program_details_id ||
            !studentAcademicDetails.year_level_id ||
            !studentAcademicDetails.semester_id
        ) {
            showMessageModal('Missing Academic Details', 'Please select the student\'s Program, Year Level, and Semester.', 'error');
            return;
        }

        // Validate at least one enrollment is added
        if (enrollments.length === 0) {
            showMessageModal('Missing Enrollments', 'A student must be enrolled in at least one class.', 'error');
            return;
        }

        setIsAddStudentModalOpen(true);
    };

    const handleConfirmAddStudent = async () => {
        setIsLoading(true);
        const submissionData = new FormData();
        // Append all formData fields
        Object.entries(formData).forEach(([key, value]) => {
            submissionData.append(key, value);
        });
        // Append student's main academic details
        Object.entries(studentAcademicDetails).forEach(([key, value]) => {
            submissionData.append(key, value);
        });

        // Append image if selected
        if (imageFile) submissionData.append('image', imageFile);
        submissionData.append('enrollments', JSON.stringify(enrollments));
        try {
            const res = await axios.post(
                'http://localhost/USTP-Student-Attendance-System/admin_backend/student_add_api.php',
                submissionData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setIsAddStudentModalOpen(false);
            handleResetForm();
            showMessageModal('Success!', 'Student added successfully!', 'success'); 
            navigate('/admin-students');
        } catch (error) {
            console.error('Failed to add student:', error.response?.data || error.message);
            showMessageModal('Error Adding Student', `Failed to add student: ${error.response?.data?.message || 'Please check the console for details.'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseAddStudentModal = () => {
        setIsAddStudentModalOpen(false);
    };

    if (loadingDropdowns) {
        return <div className="text-center mt-10">Loading form data...</div>;
    }

    if (errorDropdowns) {
        return (
            <div className="text-red-500 text-center mt-10 p-4 bg-red-100 rounded">
                <p>Error loading dropdown data: {errorDropdowns}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">
                    Retry
                </button>
            </div>
        );
    }

    // Determine if the "Add Class" section should be enabled
    const isAcademicDetailsSelected = studentAcademicDetails.program_details_id &&
                                       studentAcademicDetails.year_level_id &&
                                       studentAcademicDetails.semester_id;

    const currentSectionsForNewEnrollment = isAcademicDetailsSelected
        ? (cachedSections[`${studentAcademicDetails.year_level_id}-${studentAcademicDetails.semester_id}`] || [])
        : [];


    const studentFullName = `${formData.firstname} ${formData.middlename ? formData.middlename + ' ' : ''}${formData.lastname}`.trim();

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
                                required={['firstname', 'lastname', 'date_of_birth', 'contact_number', 'email', 'password'].includes(name)}
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

                    {/* Student Overall Academic Details - Entered Once */}
                    <div className="md:col-span-2 mt-6 border-t pt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4 flex justify-between items-center">
                            Student's Academic Details
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
                                    required
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={academicDetailsLocked} // Disable once locked
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
                                    required
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={academicDetailsLocked} // Disable once locked
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
                                    required
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={academicDetailsLocked} // Disable once locked
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
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Student Enrollments (Classes)</h2>

                        {enrollments.length === 0 && (
                            <p className="text-gray-600 mb-4">Add at least one class enrollment for the student.</p>
                        )}

                        {/* Display existing enrollments */}
                        {enrollments.map((enrollment, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-blue-50 mt-6">

                                {/* Section/Course */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Class Section</label>
                                    <input
                                        type="text"
                                        value={(() => {
                                            const cacheKey = `${enrollment.year_level_id}-${enrollment.semester_id}`;
                                            const section = cachedSections[cacheKey]?.find(sec => String(sec.section_course_id) === String(enrollment.section_course_id));
                                            return section ? `${section.section_name} - ${section.course_code} (${section.course_name})` : 'N/A';
                                        })()}
                                        disabled
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded bg-gray-100"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeEnrollment(index)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Class Section (Simplified) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-blue-50 mt-6">
                            <h3 className="col-span-full text-lg font-semibold text-blue-700 mb-2">Add New Class</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Class Section</label>
                                <select
                                    value={newEnrollmentSectionCourseId}
                                    onChange={(e) => setNewEnrollmentSectionCourseId(e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isAcademicDetailsSelected} // Disable until overall academic details are chosen
                                >
                                    <option value="">Select Class Section</option>
                                    {isAcademicDetailsSelected && currentSectionsForNewEnrollment.length > 0 ? (
                                        currentSectionsForNewEnrollment.map((sec) => (
                                            <option key={sec.section_course_id} value={sec.section_course_id}>
                                                {sec.section_name} - {sec.course_code} ({sec.course_name})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            {isAcademicDetailsSelected ? "No classes found for selected Program, Year & Semester" : "Select Program, Year & Semester first"}
                                        </option>
                                    )}
                                </select>
                            </div>

                            <div className="col-span-full flex justify-end">
                                <button
                                    type="button"
                                    onClick={addEnrollment}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                                    disabled={!isAcademicDetailsSelected} // Disable until overall academic details are chosen
                                >
                                    Add Class
                                </button>
                            </div>
                        </div>
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
                            Add Student
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
                message={`Are you sure you want to add student "${studentFullName}" with the specified enrollments?`}
                confirmText="Add Student"
                cancelText="Cancel"
                loading={isLoading}
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
