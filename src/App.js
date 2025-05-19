
import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teacher_Dashboard from "./pages/instructor/teacher_dashboard";
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';
import Admin_Students from './pages/admin_side/students';
import Dashboard from './components/dashboard';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <BrowserRouter>
      <div className="flex h-screen w-full">
        <LeftSidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Teacher_Dashboard selectedDate={selectedDate} />} />
          </Routes>
        </div>
        <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
    </BrowserRouter>
  );
}

export default App;
