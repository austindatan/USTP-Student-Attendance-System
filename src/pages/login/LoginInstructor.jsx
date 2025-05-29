import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginInstructor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/ustp-student-attendance/api/auth/login-instructor.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Error parsing JSON response:", text);
        alert("Server returned an invalid response.");
        return;
      }

      console.log("Login response:", result);

      if (result.success) {
        localStorage.setItem("instructor", JSON.stringify(result.instructor));
        localStorage.setItem("userRole", "instructor");
        navigate("/teacher-dashboard");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-dm-sans">
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: "url('assets/ustp-cdo.jpg')" }}
      ></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl shadow-md w-[90%] sm:w-full max-w-md"
      >
        <div className="flex items-center mb-6">
          <img src="assets/ustp_logo.png" className="w-12 h-12 mr-3" alt="USTP Logo" />
          <h2 className="text-xl sm:text-2xl font-bold">Instructor Portals</h2>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 relative">
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

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate('/register-instructor')}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginInstructor;
