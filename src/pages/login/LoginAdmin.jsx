import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost/USTP-Student-Attendance-System/api/auth/login-admin.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" // important for sending session cookie
    });


      const data = await response.json();

      if (data.success) {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("admin", JSON.stringify(data.user));
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-dm-sans">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: "url('assets/ustp-cdo-2.jpg')" }}
      ></div>

      {/* Login form container */}
      <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-md w-full max-w-xs sm:max-w-md mx-4 sm:mx-0 z-10">
        {error && (
          <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>
        )}

        <form onSubmit={handleLogin}>

          <div className="flex items-center mb-6">
            <img
              src="assets/ustp_logo.png"
              className="w-10 h-10 sm:w-12 sm:h-12 mr-3"
              alt="USTP Logo"
            />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              Admin Portal
            </h2>
          </div>

          <div className="mb-4 relative">
            {/* Email Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none"
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
              className="w-full border border-gray-300 pl-12 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 relative">
            {/* Password Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none"
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
              className="w-full border border-gray-300 pl-12 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
