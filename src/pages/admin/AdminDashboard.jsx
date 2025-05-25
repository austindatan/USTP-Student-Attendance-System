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

// Register Chart.js components
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

  // Example data for line chart (Students Enrolled Over Months)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: [50, 75, 60, 90, 120, 110, 130], // example enrollment counts
        fill: false,
        borderColor: 'rgb(229, 81, 130)', // pink color
        backgroundColor: 'rgb(229, 81, 130)',
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Student Enrollment' },
    },
  };

  // Example data for pie chart (Enrollment by Course)
  const pieData = {
    labels: ['BSIT', 'BSCS', 'BSCE', 'BSA', 'Other'],
    datasets: [
      {
        label: 'Enrollment by Course',
        data: [300, 150, 100, 80, 50], // example counts
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
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Student Enrollment by Course' },
    },
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to the Admin Dashboard</h1>
      <p className="mt-4 text-gray-700">You have successfully logged in as admin.</p>

      {/* Removed buttons section */}

      {/* Charts section */}
      <div
        className="mt-10 flex flex-wrap gap-8 justify-center"
        style={{ maxWidth: '1150px', margin: '0 auto' }}
      >
        <div
          className="bg-white p-4 rounded-lg shadow-md"
          style={{ width: '550px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Line data={lineData} options={lineOptions} width={520} height={360} />
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-md"
          style={{ width: '550px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Pie data={pieData} options={pieOptions} width={520} height={360} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
