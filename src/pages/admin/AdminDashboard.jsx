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

    const apiUrl = 'http://localhost/ustp-student-attendance-system/admin_backend/get_students_by_program.php';
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

  // Line Chart (Monthly Student Attendance)
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

  // Pie Chart: student count
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360 / numColors) % 360;
      colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
    }
    return colors;
  };

  const pieChartBackgroundColors = generateColors(pieLabels.length);
  const pieChartBorderColors = pieChartBackgroundColors.map(color => color.replace('0.7)', '1)'));

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: 'Student by Course',
        data: pieCounts,
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
      title: { display: true, text: 'Enrolled Student by Course' },
    },
  };

  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);


  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
        <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-[-1]">
          <div
        className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
        style={
            !loading
            ? {
                backgroundImage: "url('assets/teacher_vector.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right",
                backgroundSize: "contain"
                }
            : {}
        }
        >
        <div className="leading-none">
            {loading ? (
            <div className="animate-pulse space-y-3">
                <div className="w-1/3 h-4 bg-white/50 rounded"></div>
                <div className="w-1/2 h-8 bg-white/60 rounded"></div>
            </div>
            ) : (
            <>
                <h2 className="text-base text-blue-700 font-semibold">Welcome back,</h2>
                <h1 className="text-3xl text-blue-700 font-bold">Austin Dilan</h1>
            </>
            )}
        </div>
      </div>

      <div className="mt-5 flex flex-col md:flex-row flex-nowrap gap-8 justify-center overflow-x-auto">
        <div
          className="bg-white p-4 rounded-lg shadow-md w-full md:w-[50%] min-w-[300px]"
          style={{ minHeight: '350px', position: 'relative' }}
        >
          <Line data={lineData} options={lineOptions} />
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-md w-full md:w-[50%] min-w-[300px]"
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

        </section>
    </div>
  );
};

export default AdminDashboard;