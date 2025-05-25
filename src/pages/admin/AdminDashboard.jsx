import React, { useEffect, useState } from 'react';
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
  const [pieLabels, setPieLabels] = useState([]);
  const [pieCounts, setPieCounts] = useState([]);
  const [chartLoadingError, setChartLoadingError] = useState('');

  useEffect(() => {
  
    const apiUrl = 'http://localhost/USTP-Student-Attendance-System/admin_backend/get_students_by_program.php';
    console.log('Attempting to fetch pie chart data from:', apiUrl);

    fetch(apiUrl)
      .then((res) => {
        console.log('Network response status:', res.status, res.statusText);
        if (!res.ok) {
          
          return res.text().then(text => {
            console.error('Server response was not OK:', text);
            throw new Error(`Network response was not ok. Status: ${res.status}, Message: ${text.substring(0, 100)}...`);
          });
        }
        return res.json(); 
      })
      .then((data) => {
        console.log('Enrollment data from backend (parsed JSON):', data);
        if (data.labels && Array.isArray(data.labels) && data.counts && Array.isArray(data.counts)) {
          setPieLabels(data.labels);
          setPieCounts(data.counts);
          setChartLoadingError(''); 
        } else if (data.error) {
            setChartLoadingError(`Backend error: ${data.error} - ${data.details || ''}`);
            console.error('Backend reported an error:', data.error, data.details);
        } else {
          setChartLoadingError('Data format from backend is unexpected.');
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching pie chart data (catch block):', error);
        setChartLoadingError(`Failed to fetch chart data: ${error.message || error}`);
      });
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login-admin');
  };

  const blueBase = '#1D4ED8';

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Students Attendance',
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
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Student Attendance' },
    },
  };

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: 'Attendance by Course',
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
      title: { display: true, text: 'Student Attendance by Course' },
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-[1150px] mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 text-center sm:text-left">
        Welcome to Admin Dashboard!
      </h1>

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
          {chartLoadingError ? (
            <div className="text-center pt-16 text-red-500 font-semibold">{chartLoadingError}</div>
          ) : pieLabels.length > 0 && pieCounts.length > 0 ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <div className="text-center pt-16 text-gray-500">Loading chart data...</div>
          )}
        </div>
      </div>
      {/* You can add a logout button or other admin features here */}
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;