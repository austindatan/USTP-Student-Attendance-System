import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/confirmationmodal'; // Assuming this path is correct

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

    const [enrollments, setEnrollments] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const [programDetails, setProgramDetails] = useState([]);
    const [yearLevels, setYearLevels] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [newEnrollment, setNewEnrollment] = useState({
        program_details_id: '',
        year_level_id: '',
        semester_id: '',
        section_course_id: '',
        isNew: true,
    });

    const [cachedSections, setCachedSections] = useState({});
    const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

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
            const secRes = await axios.get('http://localhost/ustp-student-attendance/admin_backend/section_dropdown.php', { params });
            const fetchedSections = secRes.data;
            setCachedSections(prev => ({ ...prev, [cacheKey]: fetchedSections }));
            return fetchedSections;
        } catch (error) {
            console.error(`Error fetching sections for Year ${yearLevelId}, Semester ${semesterId}:`, error);
            return [];
        }
    }, [cachedSections]);

    // Initial Data Fetch Effect
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingInitialData(true);
            try {
                const [progRes, yearRes, semRes, studentRes] = await Promise.all([
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/pd_dropdown.php'),
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/get_year_levels.php'),
                    axios.get('http://localhost/ustp-student-attendance/admin_backend/get_semesters.php'),
                    axios.get(`http://localhost/ustp-student-attendance/admin_backend/student_get_api.php?student_id=${student_id}`),
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

                const tempCachedSections = {};
                const sectionFetchPromises = [];

                const initialEnrollments = (studentData.enrollments || []).map((enrollment) => {
                    if (enrollment.year_level_id && enrollment.semester_id) {
                        const cacheKey = `${enrollment.year_level_id}-${enrollment.semester_id}`;
                        if (!tempCachedSections[cacheKey]) {
                            sectionFetchPromises.push(
                                axios.get('http://localhost/ustp-student-attendance/admin_backend/section_dropdown.php', {
                                    params: { year_level_id: enrollment.year_level_id, semester_id: enrollment.semester_id }
                                }).then(res => {
                                    tempCachedSections[cacheKey] = res.data;
                                }).catch(error => {
                                    console.error(`Error fetching sections for Year ${enrollment.year_level_id}, Semester ${enrollment.semester_id}:`, error);
                                    tempCachedSections[cacheKey] = [];
                                })
                            );
                        }
                    }
                    return {
                        ...enrollment,
                        isNew: false,
                        year_level_id: enrollment.year_level_id || '',
                        semester_id: enrollment.semester_id || '',
                        section_course_id: enrollment.section_course_id || '',
                    };
                });

                await Promise.all(sectionFetchPromises);
                setCachedSections(tempCachedSections);
                setEnrollments(initialEnrollments);

            } catch (err) {
                console.error('Failed to fetch data:', err);
                alert('Failed to load student or dropdown data.');
                navigate('/admin-students');
            } finally {
                setIsLoadingInitialData(false);
            }
        };

        fetchData();
    }, [student_id, navigate]);

    const handleStudentDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Handles changes for existing enrollments
    const handleEnrollmentChange = useCallback(async (index, field, value) => {
        setEnrollments(prevEnrollments => {
            const updatedEnrollments = [...prevEnrollments];
            const currentEnrollment = { ...updatedEnrollments[index] }; // Create a mutable copy

            currentEnrollment[field] = value; // Update the field

            // If a key field of an *existing* enrollment is changed,
            // mark it as 'new' and remove its old ID.
            // This enables the "delete and re-insert" strategy on the backend.
            if (
                currentEnrollment.student_details_id && // It's an existing enrollment loaded from DB
                (field === 'program_details_id' || field === 'year_level_id' || field === 'semester_id' || field === 'section_course_id')
            ) {
                currentEnrollment.isNew = true;
                delete currentEnrollment.student_details_id;
            }


            if (field === 'year_level_id' || field === 'semester_id') {
                currentEnrollment.section_course_id = ''; // Clear section if year/semester changes
                const year = field === 'year_level_id' ? value : currentEnrollment.year_level_id;
                const semester = field === 'semester_id' ? value : currentEnrollment.semester_id;

                if (year && semester) {
                    fetchSections(year, semester); // Re-fetch sections for this enrollment
                } else {
                    // Clear sections for this index if year/semester is incomplete
                    setCachedSections(prev => ({ ...prev, [`${year}-${semester}`]: [] }));
                }
            }
            updatedEnrollments[index] = currentEnrollment; // Assign the updated enrollment back
            return updatedEnrollments;
        });
    }, [fetchSections]);


    // Handles changes for the 'newEnrollment' state
    const handleNewEnrollmentChange = useCallback(async (field, value) => {
        setNewEnrollment(currentEnrollmentState => ({ ...currentEnrollmentState, [field]: value }));

        if (field === 'year_level_id' || field === 'semester_id') {
            setNewEnrollment(currentEnrollmentState => ({ ...currentEnrollmentState, section_course_id: '' }));
            const year = field === 'year_level_id' ? value : newEnrollment.year_level_id;
            const semester = field === 'semester_id' ? value : newEnrollment.semester_id;
            if (year && semester) {
                await fetchSections(year, semester);
            }
        }
    }, [fetchSections, newEnrollment.year_level_id, newEnrollment.semester_id]);

    const addEnrollment = () => {
        if (!newEnrollment.program_details_id || !newEnrollment.section_course_id || !newEnrollment.year_level_id || !newEnrollment.semester_id) {
            alert('Please select Year Level, Semester, Program, and Section for the new enrollment before adding.');
            return;
        }

        const isDuplicate = enrollments.some(existing =>
            String(existing.section_course_id) === String(newEnrollment.section_course_id) &&
            String(existing.program_details_id) === String(newEnrollment.program_details_id)
        );

        if (isDuplicate) {
            alert('This student is already enrolled in this exact class combination.');
            return;
        }

        setEnrollments(prev => [...prev, { ...newEnrollment, isNew: true }]);
        setNewEnrollment({
            program_details_id: '',
            year_level_id: '',
            semester_id: '',
            section_course_id: '',
            isNew: true,
        });
    };

    const removeEnrollment = (index) => {
        setEnrollments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.firstname || !formData.lastname || !formData.email || !formData.date_of_birth || !formData.contact_number) {
            alert('Please fill in all required personal information fields: First Name, Last Name, Email, Date of Birth, and Contact Number.');
            return;
        }

        if (enrollments.length === 0) {
            alert('A student must be enrolled in at least one class.');
            return;
        }

        // Validate all existing enrollments before opening modal
        const hasInvalidEnrollment = enrollments.some(enrollment => {
            return !enrollment.program_details_id || !enrollment.year_level_id ||
                   !enrollment.semester_id || !enrollment.section_course_id;
        });

        if (hasInvalidEnrollment) {
            alert('Please ensure all existing enrollment fields (Program, Year Level, Semester, Section/Course) are selected for every enrollment.');
            return;
        }


        setIsEditStudentModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setIsSaving(true);
        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) { // Ensure null values are not appended, empty strings are fine
                submissionData.append(key, value);
            }
        });

        if (imageFile) {
            if (imageFile instanceof File) {
                submissionData.append('image', imageFile);
            }
        } else {
            // If imageFile is null, it means the user cleared the image.
            // Send a flag to explicitly tell PHP to clear the image.
            submissionData.append('clear_image', 'true');
        }

        const enrollmentsToSend = enrollments.map(enrollment => ({
            student_details_id: enrollment.student_details_id,
            program_details_id: enrollment.program_details_id,
            section_course_id: enrollment.section_course_id,
            isNew: enrollment.isNew,
        }));
        submissionData.append('enrollments', JSON.stringify(enrollmentsToSend));


        try {
            const res = await axios.post(
                `http://localhost/ustp-student-attendance/admin_backend/student_update_api.php?student_id=${student_id}`,
                submissionData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (res.data.success) {
                setIsEditStudentModalOpen(false);
                navigate('/admin-students');
            } else {
                alert(res.data.message || 'Update failed.');
                setIsEditStudentModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update student:', error.response?.data || error.message);
            alert(`Error updating student: ${error.response?.data?.message || 'Please check the console for details.'}`);
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

                    <div>
                        <label className="block text-sm font-semibold text-blue-700">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="md:col-span-2 mt-6 border-t pt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Student Enrollments</h2>

                        {enrollments.length === 0 && (
                            <p className="text-gray-600 mb-4">No enrollments added yet. Add a new one below.</p>
                        )}

                        {enrollments.map((enrollment, index) => (
                            <div key={enrollment.student_details_id || `new-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg mb-4 bg-gray-50">
                                {/* Year Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Year Level</label>
                                    <select
                                        value={enrollment.year_level_id}
                                        onChange={(e) => handleEnrollmentChange(index, 'year_level_id', e.target.value)}
                                        required
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
                                {/* Semester */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Semester</label>
                                    <select
                                        value={enrollment.semester_id}
                                        onChange={(e) => handleEnrollmentChange(index, 'semester_id', e.target.value)}
                                        required
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
                                {/* Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Section</label>
                                    <select
                                        value={enrollment.section_course_id}
                                        onChange={(e) => handleEnrollmentChange(index, 'section_course_id', e.target.value)}
                                        required
                                        className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Section</option>
                                        {cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`] &&
                                            cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`].length > 0 ? (
                                            cachedSections[`${enrollment.year_level_id}-${enrollment.semester_id}`].map((sec) => (
                                                <option key={sec.section_course_id} value={sec.section_course_id}>
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
                                {/* Program */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Program</label>
                                    <select
                                        value={enrollment.program_details_id}
                                        onChange={(e) => handleEnrollmentChange(index, 'program_details_id', e.target.value)}
                                        required
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
                        ))}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-blue-50 mt-6">
                            <h3 className="col-span-full text-lg font-semibold text-blue-700 mb-2">Add New Enrollment</h3>
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
                                    value={newEnrollment.section_course_id}
                                    onChange={(e) => handleNewEnrollmentChange('section_course_id', e.target.value)}
                                    className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Section</option>
                                    {newEnrollment.year_level_id && newEnrollment.semester_id && cachedSections[`${newEnrollment.year_level_id}-${newEnrollment.semester_id}`] &&
                                        cachedSections[`${newEnrollment.year_level_id}-${newEnrollment.semester_id}`].length > 0 ? (
                                        cachedSections[`${newEnrollment.year_level_id}-${newEnrollment.semester_id}`].map((sec) => (
                                            <option key={sec.section_course_id} value={sec.section_course_id}>
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

            <ConfirmationModal
                isOpen={isEditStudentModalOpen}
                onClose={handleCloseEditStudentModal}
                onConfirm={handleConfirmUpdate}
                title="Confirm Edit"
                message={`Are you sure you want to update the details and enrollments for "${studentFullName}"?`}
                confirmText="Update Student"
                loading={isSaving}
            />
        </div>
    );
}