import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teacher_Dashboard from "./pages/teacher_dashboard";
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';
import Admin_Students from './pages/admin_side/students';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-full">
        <LeftSidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Admin_Students />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
