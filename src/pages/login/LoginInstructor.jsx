import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginInstructor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/USTP-Student-Attendance-System/api/auth/login-instructor.php", {
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Instructor Login</h2>
      <form onSubmit={handleLogin} className="grid gap-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/register-instructor')}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginInstructor;
