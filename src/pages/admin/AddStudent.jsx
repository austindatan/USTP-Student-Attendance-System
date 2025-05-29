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
    });

    const [imageFile, setImageFile] = useState(null);

    // Dropdown options states
    const [instructors, setInstructors] = useState([]);
    const [programDetails, setProgramDetails] = useState([]);
    const [yearLevels, setYearLevels] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // State to manage multiple enrollments
    const [enrollments, setEnrollments] = useState([]); // Array to hold all enrollments for this new student

    // State for a *new* enrollment being added (before it's pushed to 'enrollments' array)
    const [newEnrollment, setNewEnrollment] = useState({
        instructor_id: '',
        program_details_id: '',
        year_level_id: '',
        semester_id: '',
        section_id: '',
    });

    // Cache for sections, indexed by yearLevelId-semesterId
    const [cachedSections, setCachedSections] = useState({});

    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loadingDropdowns, setLoadingDropdowns] = useState(true);
    const [errorDropdowns, setErrorDropdowns] = useState(null);

    // This function will now be responsible for fetching and caching sections
    const fetchSections = useCallback(async (yearLevelId, semesterId) => {
        if (!yearLevelId || !semesterId) {
            return []; // No year or semester selected
        }
        const cacheKey = `${yearLevelId}-${semesterId}`;
        if (cachedSections[cacheKey]) {
            return cachedSections[cacheKey]; // Return from cache if available
        }

        try {
            const params = { year_level_id: yearLevelId, semester_id: semesterId };
            const secRes = await axios.get('http://localhost/ustp-student-attendance/admin_backend/section_dropdown.php', { params });
            const fetchedSections = secRes.data;
            setCachedSections(prevCached => ({ ...prevCached, [cacheKey]: fetchedSections }));
            return fetchedSections;
        } catch (error) {
            console.error(`Error fetching sections for Year ${yearLevelId}, Semester ${semesterId}:`, error);
            return [];
        }
    }, [cachedSections]);

    // Initial dropdown data fetch (runs once on component mount)
    useEffect(() => {
        const fetchData = async () => {
            setLoadingDropdowns(true);
            setErrorDropdowns(null);
            try {
                const [instRes, progRes, yearRes, semRes] = await Promise.all([
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/instructor_dropdown.php'),
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/pd_dropdown.php'),
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/get_year_levels.php'),
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/get_semesters.php'),
                ]);

                setInstructors(instRes.data);
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
    }, []); // Empty dependency array, runs only once


    // Handles changes for the main student form data
    const handleStudentDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handles image file selection
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Handles changes for the 'newEnrollment' state
    const handleNewEnrollmentChange = useCallback(async (field, value) => {
        setNewEnrollment(prevNew => { // Corrected: prevNew is the parameter here
            const updatedNewEnrollment = { ...prevNew, [field]: value }; // Use prevNew here

            // When year or semester changes, reset section and trigger fetch
            if (field === 'year_level_id' || field === 'semester_id') {
                updatedNewEnrollment.section_id = ''; // Reset section in the updated object
                const year = field === 'year_level_id' ? value : prevNew.year_level_id; // Use prevNew for existing value
                const semester = field === 'semester_id' ? value : prevNew.semester_id; // Use prevNew for existing value
                if (year && semester) {
                    fetchSections(year, semester); // This will update cachedSections
                }
            }
            return updatedNewEnrollment;
        });
    }, [fetchSections]); // Dependency for useCallback

    // Adds the 'newEnrollment' to the 'enrollments' array
    const addEnrollment = () => {
        // Basic validation for the new enrollment fields
        if (
            !newEnrollment.instructor_id ||
            !newEnrollment.program_details_id ||
            !newEnrollment.year_level_id ||
            !newEnrollment.semester_id ||
            !newEnrollment.section_id
        ) {
            alert('Please select Instructor, Program, Year Level, Semester, and Section for the new enrollment before adding.');
            return;
        }

        // Check for duplicate enrollments (same section, instructor, program)
        const isDuplicate = enrollments.some(existing =>
            String(existing.section_id) === String(newEnrollment.section_id) &&
            String(existing.instructor_id) === String(newEnrollment.instructor_id) &&
            String(existing.program_details_id) === String(newEnrollment.program_details_id)
        );

        if (isDuplicate) {
            alert('This class (combination of section, instructor, and program) has already been added.');
            return;
        }

        setEnrollments(prevEnrollments => [...prevEnrollments, { ...newEnrollment }]);
        // Reset the new enrollment form after adding
        setNewEnrollment({
            instructor_id: '',
            program_details_id: '',
            year_level_id: '',
            semester_id: '',
            section_id: '',
        });
    };

    // Removes an enrollment from the 'enrollments' array
    const removeEnrollment = (indexToRemove) => {
        setEnrollments(prevEnrollments => prevEnrollments.filter((_, index) => index !== indexToRemove));
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
        setEnrollments([]); // Clear all added enrollments
        setNewEnrollment({ // Reset the 'add new' enrollment form
            instructor_id: '',
            program_details_id: '',
            year_level_id: '',
            semester_id: '',
            section_id: '',
        });
        setCachedSections({}); // Clear section cache
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
            alert('Please fill in all required student personal information fields.');
            return;
        }

        // Validate at least one enrollment is added
        if (enrollments.length === 0) {
            alert('A student must be enrolled in at least one class.');
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

        // Append image if selected
        if (imageFile) submissionData.append('image', imageFile);

        // Append enrollments array as a JSON string
        submissionData.append('enrollments', JSON.stringify(enrollments));

        try {
            const res = await axios.post(
                'http://localhost/ustp-student-attendance/admin_backend/student_add_api.php',
                submissionData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data' // Important for FormData
                    }
                }
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

                    {/* Dynamic Enrollments Section */}
                    <div className="md:col-span-2 mt-6 border-t pt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Student Enrollments</h2>

                        {enrollments.length === 0 && (
                            <p className="text-gray-600 mb-4">Add at least one class enrollment for the student.</p>
                        )}

                        {/* Display existing enrollments (read-only in AddStudent) */}
                        {enrollments.map((enrollment, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg mb-4 bg-gray-50">
                                {/* Year Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Year Level</label>
                                    <select
                                        value={enrollment.year_level_id}
                                        required
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled // Disable fields for added enrollments to prevent accidental changes
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
                                        value={enrollment.semester_id}
                                        required
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="">Select Semester</option>
                                        {semesters.map((sem) => (
                                            <option key={sem.semester_id} value={sem.semester_id}>
                                                {sem.semester_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Section</label>
                                    <select
                                        value={enrollment.section_id}
                                        required
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="">Select Section</option>
                                        {enrollment.year_level_id && enrollment.semester_id && cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`] &&
                                            cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`].length > 0 ? (
                                            cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`].map((sec) => (
                                                <option key={sec.section_id} value={sec.section_id}>
                                                    {sec.section_name} - {sec.course_code} ({sec.course_name})
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>
                                                {enrollment.year_level_id && enrollment.semester_id ? "No sections found" : "Select Year & Semester"}
                                            </option>
                                        )}
                                    </select>
                                </div>
                                {/* Instructor */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Instructor</label>
                                    <select
                                        value={enrollment.instructor_id}
                                        required
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="">Select Instructor</option>
                                        {instructors.map((inst) => (
                                            <option key={inst.instructor_id} value={inst.instructor_id}>
                                                {inst.firstname} {inst.lastname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Program */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Program</label>
                                    <select
                                        value={enrollment.program_details_id}
                                        required
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="">Select Program</option>
                                        {programDetails.map((prog) => (
                                            <option key={prog.program_details_id} value={prog.program_details_id}>
                                                {prog.program_name}
                                            </option>
                                        ))}
                                    </select>
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

                        {/* Add New Enrollment Section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-blue-50 mt-6">
                            <h3 className="col-span-full text-lg font-semibold text-blue-700 mb-2">Add New Class</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Year Level</label>
                                <select
                                    value={newEnrollment.year_level_id}
                                    onChange={(e) => handleNewEnrollmentChange('year_level_id', e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Year Level</option>
                                    {Array.isArray(yearLevels) && yearLevels.map((yl) => (
                                        <option key={yl.year_id} value={yl.year_id}>
                                            {yl.year_level_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Semester</label>
                                <select
                                    value={newEnrollment.semester_id}
                                    onChange={(e) => handleNewEnrollmentChange('semester_id', e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem.semester_id} value={sem.semester_id}>
                                            {sem.semester_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Section</label>
                                <select
                                    value={newEnrollment.section_id}
                                    onChange={(e) => handleNewEnrollmentChange('section_id', e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Section</option>
                                    {newEnrollment.year_level_id && newEnrollment.semester_id && cachedSections[`${newEnrollment.year_level_id}-${newEnrollment.semester_id}`] &&
                                        cachedSections[`${newEnrollment.year_level_id}-${newEnrollment.semester_id}`].length > 0 ? (
                                        cachedSections[`${newEnrollment.year_level_id}-${newEnrollment.semester_id}`].map((sec) => (
                                            <option key={sec.section_id} value={sec.section_id}>
                                                {sec.section_name} - {sec.course_code} ({sec.course_name})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            {newEnrollment.year_level_id && newEnrollment.semester_id ? "No sections found" : "Select Year & Semester first"}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Instructor</label>
                                <select
                                    value={newEnrollment.instructor_id}
                                    onChange={(e) => handleNewEnrollmentChange('instructor_id', e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <label className="block text-sm font-semibold text-gray-700">Program</label>
                                <select
                                    value={newEnrollment.program_details_id}
                                    onChange={(e) => handleNewEnrollmentChange('program_details_id', e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Program</option>
                                    {programDetails.map((prog) => (
                                        <option key={prog.program_details_id} value={prog.program_details_id}>
                                            {prog.program_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-full flex justify-end">
                                <button
                                    type="button"
                                    onClick={addEnrollment}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
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
                message={`Are you sure you want to add ${formData.firstname} ${formData.lastname} as a new student with ${enrollments.length} class(es)?`}
                confirmText="Add Student"
                loading={isLoading}
                confirmButtonClass="bg-blue-700 hover:bg-blue-800"
            />
        </div>
    );
}