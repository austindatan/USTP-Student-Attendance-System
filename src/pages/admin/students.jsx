import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is set up

/**
 * ClassDropdown Component
 * Displays a list of classes in a dropdown, adjusting its direction (up/down)
 * to prevent overlapping the bottom of the screen.
 *
 * @param {object} props - The component props.
 * @param {string} props.classes - A semicolon-separated string of class names.
 * @param {boolean} props.isLastEight - Indicates if this dropdown is for one of the last 8 students.
 */
const ClassDropdown = ({ classes, isLastEight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState('down'); // 'down' or 'up'
  const dropdownRef = useRef(null); // Reference to the dropdown container div
  const buttonRef = useRef(null); // Reference to the button element

  /**
   * Toggles the dropdown's open/close state.
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Effect to handle clicks outside the dropdown to close it.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open and the click is outside the dropdown container, close it.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Split the classes string into an array and filter out empty items
  // This needs to be done before the useEffect that depends on classList.length
  // NOTE: The .filter(item => item !== '') removes any empty strings
  // that might result from trailing semicolons or double semicolons in the input string.
  // This is a common reason why "added courses" might not match "displayed courses"
  // if the input string format creates empty entries.
  const classList = classes ? classes.split(';').map(item => item.trim()).filter(item => item !== '') : [];


  /**
   * Effect to calculate the dropdown's opening direction (up or down).
   * This runs when the dropdown opens or the class list changes.
   * IMPORTANT: This useEffect is now unconditionally called at the top level.
   */
  useEffect(() => {
    // Only calculate direction if the dropdown is open and references are available
    if (isOpen && dropdownRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect(); // Get button's position and size
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight; // Get viewport height

      // Calculate a more accurate estimated dropdown height based on the number of items.
      // Each class item (including its padding and line-height) is approximately 44px tall.
      // The dropdown content div itself has py-1 (8px total vertical padding).
      const itemHeight = 44;
      const dropdownContainerPadding = 8; // py-1 on the inner div
      const estimatedDropdownHeight = (classList.length * itemHeight) + dropdownContainerPadding;

      const spaceBelow = viewportHeight - buttonRect.bottom; // Space from button bottom to viewport bottom
      const spaceAbove = buttonRect.top; // Space from button top to viewport top

      // Determine direction:
      // If it's one of the last 8 items AND there's sufficient space above, prioritize opening upwards.
      if (isLastEight && spaceAbove > estimatedDropdownHeight) {
        setDropdownDirection('up');
      } else if ((spaceBelow < 200 || spaceBelow < estimatedDropdownHeight) && spaceAbove > estimatedDropdownHeight) {
        // Fallback to existing logic: if not among last 8, or if last 8 but no space above,
        // open upwards if general space conditions allow.
        setDropdownDirection('up');
      } else {
        // Otherwise, open downwards.
        setDropdownDirection('down');
      }
    }
  }, [isOpen, classes, classList.length, isLastEight]); // Add isLastEight to dependencies

  // Handle cases where classes prop is null/undefined or empty after classList is derived
  if (!classes) {
    return <span className="text-gray-500">N/A</span>;
  }

  if (classList.length === 0) {
    return <span className="text-gray-500">None</span>;
  }

  // Dynamically apply Tailwind CSS classes based on dropdown direction
  const dropdownClasses = `
    absolute left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10
    ${dropdownDirection === 'up' ? 'origin-bottom-left bottom-full mb-2' : 'origin-top-left top-full mt-2'}
  `;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        onClick={toggleDropdown}
        ref={buttonRef} // Assign the button ref for position calculation
      >
        View Classes
        {/* Dropdown arrow icon */}
        <svg className="-mr-1 ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Render dropdown content only if isOpen is true */}
      {isOpen && (
        <div className={dropdownClasses} role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <div className="py-1">
            {classList.map((cls, index) => (
              <span
                key={index}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                role="menuitem"
              >
                <div className="rounded-md border border-gray-200 bg-gray-50 py-1 px-2">
                  {cls}
                </div>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Admin_Students Component
 * Displays a list of students, allows searching, adding, editing, and deleting students.
 * Includes a confirmation modal for deletion and a message display for feedback.
 */
export default function Admin_Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for delete confirmation modal
  const [selectedStudent, setSelectedStudent] = useState(null); // State to hold student selected for deletion
  const [message, setMessage] = useState(""); // State for general success/error messages
  const [isMessageError, setIsMessageError] = useState(false); // State to differentiate success/error messages
  const navigate = useNavigate(); // Hook for navigation (e.g., to add/edit pages)

  /**
   * Fetches student data from the backend API.
   */
  const fetchStudents = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors
    try {
      const res = await axios.get(
        "http://localhost/USTP-Student-Attendance-System/admin_backend/student_api.php"
      );

      let data = [];
      // Check if the response data is an array or contains a 'students' array
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.students)) {
        data = res.data.students;
      }

      // Sort students by student_id
      data.sort((a, b) => a.student_id - b.student_id);
      setStudents(data); // Update students state
    } catch (err) {
      console.error("Failed to fetch students:", err); // Log the error
      setError("Failed to fetch students. Please try again."); // Set user-friendly error message
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  /**
   * Effect to fetch students when the component mounts.
   */
  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array means this effect runs once on mount

  /**
   * Handles the click event for deleting a student, opening the confirmation modal.
   * @param {object} student - The student object to be deleted.
   */
  const handleDeleteClick = (student) => {
    setSelectedStudent(student); // Store the student to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  /**
   * Confirms and performs the student deletion.
   * Sends a DELETE request to the backend.
   */
  const confirmDelete = async () => {
    if (!selectedStudent) return; // Guard clause if no student is selected

    try {
      const res = await axios.post(
        'http://localhost/USTP-Student-Attendance-System/admin_backend/delete_student.php',
        {
          _method: 'DELETE', // Laravel/PHP common method override for DELETE requests
          student_id: selectedStudent.student_id,
        }
      );

      if (res.data.success) {
        // Filter out the deleted student from the current list
        setStudents(students.filter(s => s.student_id !== selectedStudent.student_id));
        setMessage("Student deleted successfully!"); // Set success message
        setIsMessageError(false); // Indicate success message
      } else {
        setMessage(res.data.message || "Failed to delete student."); // Set error message from backend
        setIsMessageError(true); // Indicate error message
      }
    } catch (err) {
      console.error("Delete error:", err); // Log the detailed error
      setMessage("An error occurred while deleting the student."); // Set generic error message
      setIsMessageError(true); // Indicate error message
    } finally {
      setIsModalOpen(false); // Close the modal
      setSelectedStudent(null); // Clear the selected student
      // Automatically hide the message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setIsMessageError(false);
      }, 3000);
    }
  };

  /**
   * Filters the students based on the search term.
   */
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.toLowerCase();
    const enrolledClasses = (student.enrolled_classes || '').toLowerCase(); // Handle null/undefined classes
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Check if full name or enrolled classes include the search term
    return fullName.includes(lowerCaseSearchTerm) || enrolledClasses.includes(lowerCaseSearchTerm);
  });

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      {/* Floating message display */}
      {message && (
        <div className={`fixed top-4 right-4 p-3 rounded-md shadow-lg z-50 transition-opacity duration-300 ${isMessageError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {message}
        </div>
      )}

      <section className="w-full pt-6 px-4 sm:pt-12 sm:px-6 md:px-8 lg:px-12 mb-12 z-0">
        {/* Header section with student list title and background image */}
        <div
          className="bg-white rounded-lg p-4 sm:p-6 mb-6 relative overflow-hidden"
          style={
            !loading
              ? {
                  // Using placehold.co for Canvas compatibility
                  backgroundImage: "url('assets/teacher_vector.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right",
                  backgroundSize: "contain",
                }
              : {}
          }
        >
          <div className="leading-none">
            {loading ? (
              // Skeleton loading animation for header
              <div className="animate-pulse space-y-3">
                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <h1
                className="text-xl sm:text-2xl text-blue-700 font-bold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Student List
              </h1>
            )}
          </div>
        </div>

        {/* Main content area with search, add button, and student table */}
        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <p className="text-blue-700 font-semibold whitespace-nowrap">
              Total Students: {filteredStudents.length}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Search input field */}
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
              />
              {/* Add Student button */}
              <button
                onClick={() => navigate("/admin-students/add")}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
              >
                + Add Student
              </button>
            </div>
          </div>

          {loading ? (
            // Loading message for table
            <p className="text-center text-gray-500">Loading students...</p>
          ) : error ? (
            // Error message for table
            <p className="text-center text-red-500">{error}</p>
          ) : (
            // Student data table
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse table-auto sm:table-fixed w-full">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    <th className="px-3 py-2 w-[7%]">Stu. ID</th>
                    <th className="px-3 py-2 w-[22%]">Full Name</th>
                    <th className="px-3 py-2 w-[15%]">Enrolled Classes</th>
                    <th className="px-3 py-2 w-[10%]">Program</th>
                    <th className="px-3 py-2 w-[12%]">Birthdate</th>
                    <th className="px-3 py-2 w-[13%]">Contact Number</th>
                    <th className="px-3 py-2 w-[20%]">Address</th>
                    <th className="px-3 py-2 w-[10%] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    // Message when no students are found after filtering
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    // Map through filtered students and display each row
                    filteredStudents.map((student, index) => {
                      // Determine if the current student is among the last 8
                      const isLastEight = index >= filteredStudents.length - 8;
                      return (
                        <tr
                          key={student.student_id}
                          className="border-b border-blue-200 hover:bg-blue-50"
                        >
                          <td className="px-3 py-2 truncate">{student.student_id}</td>
                          <td className="px-3 py-2 truncate">
                            {student.firstname} {student.middlename} {student.lastname}
                          </td>
                          {/* Pass the new isLastEight prop to ClassDropdown */}
                          <td className="px-3 py-2 min-w-0">
                            <ClassDropdown classes={student.enrolled_classes} isLastEight={isLastEight} />
                          </td>
                          <td className="px-3 py-2 truncate min-w-0">{student.program_name}</td>
                          <td className="px-3 py-2 truncate min-w-0">{student.date_of_birth}</td>
                          <td className="px-3 py-2 truncate min-w-0">{student.contact_number}</td>
                          <td className="px-3 py-2 truncate min-w-0">
                            {student.street} {student.city} {student.province} {student.zipcode}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col sm:flex-row gap-1 justify-center">
                              {/* Edit button */}
                              <button
                                onClick={() =>
                                  navigate(`/admin-students/edit/${student.student_id}`)
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                              >
                                Edit
                              </button>
                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteClick(student)}
                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {selectedStudent.firstname} {selectedStudent.lastname}{" "}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
