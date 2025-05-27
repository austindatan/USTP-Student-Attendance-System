import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterInstructor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "", password: "", firstname: "", middlename: "", lastname: "",
    date_of_birth: "", contact_number: "", street: "", city: "",
    province: "", zipcode: "", country: "", image: null
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!form.firstname) newErrors.firstname = "First Name is required";
    if (!form.middlename) newErrors.middlename = "Middle Name is required";
    if (!form.lastname) newErrors.lastname = "Last Name is required";
    if (!form.date_of_birth) newErrors.date_of_birth = "Date of Birth is required";
    if (!form.contact_number) newErrors.contact_number = "Contact Number is required";
    if (!form.street) newErrors.street = "Street is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.province) newErrors.province = "Province is required";
    if (!form.zipcode) newErrors.zipcode = "Zipcode is required";
    if (!form.country) newErrors.country = "Country is required";

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    try {
      const res = await fetch("http://localhost/USTP-Student-Attendance-System/api/auth/register-instructor.php", {
        method: "POST",
        body: data
      });
      const result = await res.json();

      if (result.success) {
        alert("Registered successfully!");
        navigate("/login-instructor");
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  };

  const renderError = (field) => {
    return errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-100 font-dm-sans">

      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('assets/ustp-cdo-3.jpg')" }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4"
        noValidate
      >
        <div className="flex items-center justify-between">
          <img src="assets/ustp_logo.png" className="w-10 h-10" alt="USTP Logo" />
          <h2 className="text-lg sm:text-xl font-bold">Instructor Registration</h2>
        </div>

        {/* Image preview + upload */}
        <div className="text-center">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
            />
          )}
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="text-sm" />
        </div>

        {/* Name Fields */}
        <div className="flex flex-col sm:flex-row gap-2">
          {["firstname", "middlename", "lastname"].map(field => (
            <div key={field} className="flex-1">
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded ${errors[field] ? 'border-red-500' : ''}`}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
              />
              {renderError(field)}
            </div>
          ))}
        </div>

        {/* Email + Password */}
        <div className="flex flex-col sm:flex-row gap-2">
          {["email", "password"].map(field => (
            <div key={field} className="flex-1">
              <input
                type={field === "password" ? "password" : "email"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded ${errors[field] ? 'border-red-500' : ''}`}
                placeholder={field === "email" ? "Email" : "Password"}
              />
              {renderError(field)}
            </div>
          ))}
        </div>

        {/* Date of Birth + Contact */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded ${errors.date_of_birth ? 'border-red-500' : ''}`}
            />
            {renderError("date_of_birth")}
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded ${errors.contact_number ? 'border-red-500' : ''}`}
              placeholder="Contact Number"
            />
            {renderError("contact_number")}
          </div>
        </div>

        {/* Address Fields */}
        <div className="flex flex-col sm:flex-row gap-2">
          {["street", "city"].map(field => (
            <div key={field} className="flex-1">
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded ${errors[field] ? 'border-red-500' : ''}`}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
              {renderError(field)}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              name="province"
              value={form.province}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded ${errors.province ? 'border-red-500' : ''}`}
              placeholder="Province"
            />
            {renderError("province")}
          </div>
          <div className="w-1/3">
            <input
              type="text"
              name="zipcode"
              value={form.zipcode}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded ${errors.zipcode ? 'border-red-500' : ''}`}
              placeholder="Zipcode"
            />
            {renderError("zipcode")}
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded ${errors.country ? 'border-red-500' : ''}`}
              placeholder="Country"
            />
            {renderError("country")}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition"
        >
          Register
        </button>

        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login-instructor")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterInstructor;
