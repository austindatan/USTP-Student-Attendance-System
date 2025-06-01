import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Skeleton component for loading states
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const StudentEditProfile = () => {
  const [formData, setFormData] = useState({
    student_id: "", // This will be updated with the fetched 'id' later
    email: "",
    password: "",
    firstname: "",
    middlename: "",
    lastname: "",
    date_of_birth: "",
    contact_number: "",
    street: "",
    city: "",
    province: "",
    zipcode: "",
    country: "",
    image: "",
  });
  const [message, setMessage] = useState(""); // For general error/info messages
  const [loading, setLoading] = useState(true);
  const [previewURL, setPreviewURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for confirmation modal

  const navigate = useNavigate();

  // Effect to fetch student data on component mount
  useEffect(() => {
    let studentIdToFetch = null;
    try {
      const storedStudent = JSON.parse(localStorage.getItem("student"));
      // Look for 'id' instead of 'student_id' from localStorage
      if (storedStudent && storedStudent.id) {
        studentIdToFetch = storedStudent.id;
      }
    } catch (e) {
      console.error("Error parsing student data from localStorage:", e);
    }

    if (!studentIdToFetch) {
      setMessage("Student ID not found in local storage. Please log in again.");
      setLoading(false);
      return;
    }

    // Fetch student data from the API
    fetch(
      `http://localhost/ustp-student-attendance-system/api/GetStudent.php?id=${studentIdToFetch}`
    )
      .then((res) => {
        if (!res.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          return res.text().then((text) => {
            throw new Error(
              `HTTP error! Status: ${res.status}, Response: ${text.substring(
                0,
                200
              )}`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          // Set form data with fetched student information
          setFormData(data.student);

          // Resolve and set the image preview URL
          const image = data.student.image;
          const resolvedURL = image
            ? `http://localhost/ustp-student-attendance-system/uploads/${image.replace(
                "uploads/",
                ""
              )}`
            : "";
          setPreviewURL(resolvedURL);
        } else {
          // Display error message from the API
          setMessage(`Failed to fetch student info: ${data.message}`);
        }
        setTimeout(() => setLoading(false), 800); // Simulate loading time
      })
      .catch((error) => {
        // Catch network errors or JSON parsing issues
        console.error("Fetch error during profile load:", error);
        setMessage(`Server error while loading profile: ${error.message}`);
        setTimeout(() => setLoading(false), 800); // Simulate loading time
      });
  }, []);

  // Handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for file input change (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file)); // Create a local URL for image preview
    }
  };

  // Handler for form submission (shows confirmation modal)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  // Function to confirm and proceed with profile update
  const confirmUpdate = async () => {
    setShowConfirmationModal(false); // Hide the confirmation modal
    setMessage(""); // Clear any previous messages

    const formPayload = new FormData();
    // Append all current form data to the FormData object
    Object.keys(formData).forEach((key) =>
      formPayload.append(key, formData[key])
    );

    // Append the selected image file if it exists
    if (selectedFile) {
      formPayload.append("image", selectedFile);
    }

    try {
      const res = await fetch(
        "http://localhost/ustp-student-attendance-system/api/EditStudentProfile.php",
        {
          method: "POST",
          body: formPayload,
        }
      );

      if (!res.ok) {
        // Handle HTTP errors during update
        const errorText = await res.text();
        throw new Error(
          `HTTP error! Status: ${res.status}, Response: ${errorText.substring(
            0,
            200
          )}`
        );
      }

      const result = await res.json();
      if (result.success) {
        // Update localStorage with the new student data
        const { firstname, middlename, lastname } = result.student;
        const name = [firstname, middlename, lastname].filter(Boolean).join(" ");
        const updatedStudent = { ...result.student, id: result.student.student_id, name };
        localStorage.setItem("student", JSON.stringify(updatedStudent));

        // Directly navigate to Dashboard on success, without a success modal
        navigate("/student-Dashboard");
      } else {
        // Display API-returned error message
        setMessage(`Profile update failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Update fetch error:", error);
      // Display client-side error message
      setMessage("Profile update failed due to a server error: " + error.message);
    }
  };

  // Handler for navigating back to the Dashboard
  const handleBack = () => {
    navigate("/student-Dashboard");
  };

  return (
    <div className="font-dm-sans px-4 sm:px-10 py-6 sm:py-10 text-left w-full max-w-[85%] sm:max-w-2xl ml-4 sm:ml-[200px] text-sm sm:text-base mt-10 mb-10 bg-white rounded-lg shadow-lg transition-all duration-300">
      <div className="mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/271/271220.png"
            alt="Back"
            className="w-5 h-5"
          />
          <span>Back</span>
        </button>
      </div>

      <h2 className="text-2xl sm:text-3xl text-center font-bold mb-4">
        Edit Profile
      </h2>

      {message && <p className="mb-4 text-red-500 text-center">{message}</p>}

      <form
        onSubmit={handleSubmit} // This now triggers the confirmation modal
        encType="multipart/form-data"
        className="grid gap-4"
      >
        {loading ? (
          <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto" />
        ) : (
          previewURL && (
            <img
              src={previewURL}
              alt="Profile Preview"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mx-auto"
            />
          )
        )}

        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First Name"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
                placeholder="Middle Name"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-2 border rounded w-full"
              />
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="Contact Number"
                className="p-2 border rounded w-full"
              />
            </>
          )}
        </div>

        {loading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border rounded w-full"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-2 border rounded w-full"
            />
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="p-2 border rounded w-full"
              />
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="Province"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="Zipcode"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="p-2 border rounded w-full"
              />
            </>
          )}
        </div>

        {!loading && (
          <button
            type="submit"
            className="bg-[#7685fc] text-white py-2 px-4 rounded hover:bg-[#5f70db] transition-colors mt-4 w-full sm:w-auto"
          >
            Update Profile
          </button>
        )}
      </form>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Profile Update
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to update your profile with the current
              information?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate} // Call confirmUpdate when confirmed
                className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEditProfile;