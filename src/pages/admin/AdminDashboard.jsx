import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login-admin');
  };

  const blueBase = '#1D4ED8'; // Tailwind text-blue-700

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: [50, 75, 60, 90, 120, 110, 130],
        fill: false,
        borderColor: blueBase,
        backgroundColor: blueBase,
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false, // allow flexible height
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Student Enrollment' },
    },
  };

  const pieData = {
    labels: ['BSIT', 'BSCS', 'BSCE', 'BSA', 'Other'],
    datasets: [
      {
        label: 'Enrollment by Course',
        data: [300, 150, 100, 80, 50],
        backgroundColor: [
          'rgba(229, 81, 130, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(229, 81, 130, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Student Enrollment by Course' },
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-[1150px] mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 text-center sm:text-left">
        Welcome to Admin Dashboard!
      </h1>

      {/* Charts container */}
      <div className="mt-10 flex flex-col md:flex-row flex-wrap gap-8 justify-center">
        <div
          className="bg-white p-4 rounded-lg shadow-md w-full md:w-[48%]"
          style={{ minHeight: '350px', position: 'relative' }}
        >
          <Line data={lineData} options={lineOptions} />
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-md w-full md:w-[48%]"
          style={{ minHeight: '350px', position: 'relative' }}
        >
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
