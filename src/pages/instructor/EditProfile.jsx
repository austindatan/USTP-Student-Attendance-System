import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const EditProfile = () => {
  const [formData, setFormData] = useState({
    instructor_id: "",
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    const storedInstructor = JSON.parse(localStorage.getItem("instructor"));
    if (!storedInstructor) {
      setMessage("Instructor not logged in.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost/ustp-student-attendance/api/get_instructor.php?id=${storedInstructor.instructor_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFormData(data.instructor);

          const image = data.instructor.image;
          const resolvedURL = image.includes("uploads/")
            ? `http://localhost/ustp-student-attendance/api/${image}`
            : `http://localhost/ustp-student-attendance/api/uploads/${image}`;

          setPreviewURL(resolvedURL);
        } else {
          setMessage("Failed to fetch instructor info.");
        }

        setTimeout(() => {
          setLoading(false);
        }, 800);
      })
      .catch(() => {
        setMessage("Server error while loading profile.");
        setTimeout(() => {
          setLoading(false);
        }, 800);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const confirmUpdate = async () => {
    setShowConfirmationModal(false); // Hide the confirmation modal
    setMessage(""); // Clear any previous messages

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) =>
      formPayload.append(key, formData[key])
    );

    if (selectedFile) {
      formPayload.append("image", selectedFile);
    }

    try {
      const res = await fetch(
        "http://localhost/ustp-student-attendance/api/edit_profile.php",
        {
          method: "POST",
          body: formPayload,
        }
      );

      const result = await res.json();
      if (result.success) {
        localStorage.setItem("instructor", JSON.stringify(result.instructor));
        navigate("/teacher-dashboard");
      } else {
      }
    } catch (error) {
      console.error("Update fetch error:", error);
      setMessage("Profile update failed due to a server error.");
    }
  };

  const handleBack = () => {
    navigate("/teacher-dashboard");
  };

  return (
    <div className="font-dm-sans px-4 sm:px-10 py-6 sm:py-10 text-left w-full max-w-[85%] sm:max-w-2xl mx-auto text-sm sm:text-base mt-10 mb-10 bg-white rounded-lg shadow-lg transition-all duration-300">
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

export default EditProfile;