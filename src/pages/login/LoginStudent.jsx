import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginStudent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost/ustp-student-attendance/api/auth/login-student.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Save user session
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('student', JSON.stringify(data.user));
            navigate("/student-dashboard");
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center font-dm-sans">
            {/* Overlay background */}
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            <div
                className="absolute inset-0 bg-cover bg-center z-[-1]"
                style={{ backgroundImage: "url('assets/ustp-cdo-3.jpg')" }}
            ></div>

            {/* Login form */}
            <form
                onSubmit={handleLogin}
                className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl shadow-md w-[90%] sm:w-full max-w-md"
            >
                
                <img src="assets/ustp_logo.png" className="w-24 h-24 block mx-auto mb-2" alt="USTP Logo" />

                <h2 className="text-xl sm:text-xl font-bold text-center text-gray-600">Student Attendance Monitor</h2>

                <h2 className="text-xl sm:text-base font-bold text-center mb-4 text-gray-600">Login to your account.</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4 relative">
                    {/* Email icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-300 pl-12 pr-3 py-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6 relative">
                    {/* Password icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                    </svg>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 pl-12 pr-3 py-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                    Login
                </button>
            </form>
        </div>

    );
};

export default LoginStudent;