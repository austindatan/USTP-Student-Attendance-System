import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teacher_Dashboard from "./pages/instructor/teacher_dashboard";
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-full">
        <LeftSidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Teacher_Dashboard />} />
          </Routes>
        </div>
        <RightSidebar />
      </div>
    </BrowserRouter>
  );
}

export default App;
