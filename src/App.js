import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Teacher_Dashboard from "./pages/instructor/teacher_dashboard";
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';
import Admin_Students from './pages/admin_side/students';
import Dashboard from './components/dashboard';
import DropRequests from './pages/admin_side/drop_requests';

// Create a wrapper component to get current location (route)
function Layout() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Conditionally render RightSidebar only if NOT on "/drop_requests"
  const showRightSidebar = location.pathname !== "/drop_requests";

  return (
    <div className="flex h-screen w-full">
      <LeftSidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Teacher_Dashboard selectedDate={selectedDate} />} />
          <Route path="/drop_requests" element={<DropRequests />} />
          {/* Add other routes here */}
        </Routes>
      </div>
      {showRightSidebar && (
        <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
