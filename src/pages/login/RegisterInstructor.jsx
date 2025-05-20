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
      const res = await fetch("http://localhost/ustp-student-attendance/api/auth/register-instructor.php", {
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

  // show errors each input
  const renderError = (field) => {
    if (!errors[field]) return null;
    return <p className="text-red-600 text-sm mt-1">{errors[field]}</p>;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Instructor Registration</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
        {/* Email */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-600' : ''}`}
            required
          />
          {renderError("email")}
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password" name="password" value={form.password} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-600' : ''}`}
            required
          />
          {renderError("password")}
        </div>

        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text" name="firstname" value={form.firstname} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.firstname ? 'border-red-600' : ''}`}
            required
          />
          {renderError("firstname")}
        </div>

        {/* Middle Name */}
        <div>
          <label className="block mb-1 font-medium">Middle Name</label>
          <input
            type="text" name="middlename" value={form.middlename} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.middlename ? 'border-red-600' : ''}`}
            required
          />
          {renderError("middlename")}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text" name="lastname" value={form.lastname} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.lastname ? 'border-red-600' : ''}`}
            required
          />
          {renderError("lastname")}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.date_of_birth ? 'border-red-600' : ''}`}
            required
          />
          {renderError("date_of_birth")}
        </div>

        {/* Contact Number */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Contact Number</label>
          <input
            type="text" name="contact_number" value={form.contact_number} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.contact_number ? 'border-red-600' : ''}`}
            required
          />
          {renderError("contact_number")}
        </div>

        {/* Street */}
        <div>
          <label className="block mb-1 font-medium">Street</label>
          <input
            type="text" name="street" value={form.street} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.street ? 'border-red-600' : ''}`}
            required
          />
          {renderError("street")}
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text" name="city" value={form.city} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.city ? 'border-red-600' : ''}`}
            required
          />
          {renderError("city")}
        </div>

        {/* Province */}
        <div>
          <label className="block mb-1 font-medium">Province</label>
          <input
            type="text" name="province" value={form.province} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.province ? 'border-red-600' : ''}`}
            required
          />
          {renderError("province")}
        </div>

        {/* Zipcode */}
        <div>
          <label className="block mb-1 font-medium">Zipcode</label>
          <input
            type="text" name="zipcode" value={form.zipcode} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.zipcode ? 'border-red-600' : ''}`}
            required
          />
          {renderError("zipcode")}
        </div>

        {/* Country */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Country</label>
          <input
            type="text" name="country" value={form.country} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.country ? 'border-red-600' : ''}`}
            required
          />
          {renderError("country")}
        </div>

        {/* Profile Image */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Profile Image (optional)</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />
          {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />}
        </div>

        {/* Submit button */}
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">Register</button>
        </div>
      </form>

      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/login-instructor')}>
          Login here
        </span>
      </p>
    </div>
  );
};

export default RegisterInstructor;
