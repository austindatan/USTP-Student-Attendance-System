import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';

function App() {
  return (
    <BrowserRouter>
      <LeftSidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <RightSidebar />
    </BrowserRouter>
  );
}

export default App;
