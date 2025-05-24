import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    useEffect(() => {
        const storedInstructor = JSON.parse(localStorage.getItem("instructor"));
        if (!storedInstructor) {
            setMessage("Instructor not logged in.");
            return;
        }

        fetch(`http://localhost/ustp-student-attendance/api/get_instructor.php?id=${storedInstructor.instructor_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setFormData(data.instructor);
                
                if (data.instructor.image) {
                    setPreviewURL(`http://localhost/ustp-student-attendance/api/uploads/${data.instructor.image}`);
                } else {
                    setPreviewURL("http://localhost/ustp-student-attendance/api/${data.instructor.image}");
                }
            } else {
                setMessage("Failed to fetch instructor info.");
            }
        })
        .catch(() => setMessage("Server error while loading profile."));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        const formPayload = new FormData();
        Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));

        if (selectedFile) {
            formPayload.append("image", selectedFile);
        }

        const res = await fetch("http://localhost/ustp-student-attendance/api/edit_profile.php", {
            method: "POST",
            body: formPayload,
        });

        const result = await res.json();
        if (result.success) {
            alert("Profile updated successfully.");
            localStorage.setItem("instructor", JSON.stringify(result.instructor));
            navigate("/teacher-dashboard");
        } else {
            alert("Update failed: " + result.message);
        }
    };

    const handleBack = () => {
        navigate("/teacher-dashboard");
    };

    return (
        <div
        className="bg-cover bg-center bg-fixed flex justify-center items-center min-h-screen w-full overflow-auto"
        >

        <div className="font-dm-sans px-4 py-6 sm:p-8 text-left max-w-6xl mx-auto text-base sm:text-lg mt-10 mb-10 bg-white rounded-lg shadow-lg w-fit">
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

            <h2 className="text-2xl text-center font-bold mb-4">Edit Profile</h2>

            {message && <p className="mb-4 text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4">
                {previewURL && (
                    <img
                        src={previewURL}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                )}
                <input type="file" name="image" accept="image/*" className="text-center" onChange={handleFileChange} />

                <div class="flex flex-row gap-5">
                    <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" />
                    <input type="text" name="middlename" value={formData.middlename} onChange={handleChange} placeholder="Middle Name" className="p-2 border rounded" />
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" />
                </div>

                <div class="flex flex-row gap-5">
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="p-2 border rounded flex-1" />
                    <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" className="p-2 border rounded flex-1" />
                </div>

                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="p-2 border rounded" />
                
                <div class="flex flex-row gap-5">
                    <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" className="p-2 border rounded flex-1" />
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-2 border rounded flex-1" />
                </div>
                
                <div class="flex flex-row gap-5">
                    <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Province" className="p-2 border rounded flex-1" />
                    <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="Zipcode" className="p-2 border rounded flex-1" />
                    <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="p-2 border rounded flex-1" />
                </div>

                <button type="submit" className="bg-[#7685fc] text-white py-2 rounded">Update Profile</button>
            </form>
        </div>
    </div>
    );
};

export default EditProfile;
