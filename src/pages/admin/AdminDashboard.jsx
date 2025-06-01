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
  const [lineLabels, setLineLabels] = useState([]);
  const [lineCounts, setLineCounts] = useState([]);
  const [chartLoadingError, setChartLoadingError] = useState(''); 
  const [lineChartError, setLineChartError] = useState(''); 
  const [loading, setLoading] = useState(true);

  const blueBase = '#1D4ED8';

  useEffect(() => {
    const apiUrl = 'http://localhost/USTP-Student-Attendance-System/admin_backend/get_students_by_program.php';
    console.log('Fetching pie chart data from:', apiUrl);

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`Network response for pie chart was not ok. Status: ${res.status}, Message: ${text.substring(0, 100)}...`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Pie chart raw data received:', data);
        if (data.labels && Array.isArray(data.labels) && data.counts && Array.isArray(data.counts)) {
          setPieLabels(data.labels);
          setPieCounts(data.counts);
          setChartLoadingError('');
          console.log('Pie chart data set:', data.labels, data.counts);
        } else if (data.error) {
            setChartLoadingError(`Backend error for pie chart: ${data.error} - ${data.details || ''}`);
            console.error('Backend reported error for pie chart:', data.error, data.details);
        } else {
          setChartLoadingError('Pie chart data format from backend is unexpected.');
          console.error('Unexpected pie chart data format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching pie chart data (catch block):', error);
        setChartLoadingError(`Failed to fetch pie chart data: ${error.message || error}`);
      });
  }, []);

  useEffect(() => {
    const apiUrl = 'http://localhost/USTP-Student-Attendance-System/admin_backend/get_monthly_attendance.php';
    console.log('Fetching line chart data from:', apiUrl);

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`Network response for line chart was not ok. Status: ${res.status}, Message: ${text.substring(0, 100)}...`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Line chart raw data received:', data);
        if (data.labels && Array.isArray(data.labels) && data.counts && Array.isArray(data.counts)) {
          const numericCounts = data.counts.map(Number);
          setLineLabels(data.labels);
          setLineCounts(numericCounts);
          setLineChartError('');
          console.log('Line chart data set:', data.labels, numericCounts);
        } else if (data.error) {
            setLineChartError(`Backend error for line chart: ${data.error} - ${data.details || ''}`);
            console.error('Backend reported error for line chart:', data.error, data.details);
        } else {
          setLineChartError('Line chart data format from backend is unexpected.');
          console.error('Unexpected line chart data format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching line chart data (catch block):', error);
        setLineChartError(`Failed to fetch line chart data: ${error.message || error}`);
      });
  }, []);


  useEffect(() => {
    console.log('Line Chart Data for rendering:', { labels: lineLabels, counts: lineCounts });
  }, [lineLabels, lineCounts]);


  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Students Attendance',
        data: lineCounts,
        fill: false,
        borderColor: blueBase,
        backgroundColor: blueBase,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: blueBase,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Student Attendance' },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
          title: (context) => {
            return context[0].label;
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          }
        },
      }
    }
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors;
      colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
    }
    return colors;
  };

  const pieChartBackgroundColors = generateColors(pieLabels.length);
  const pieChartBorderColors = pieChartBackgroundColors.map(color =>
    color.replace('0.7)', '1)')
  );

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: 'Student by Course',
        data: pieCounts,
        backgroundColor: pieChartBackgroundColors,
        borderColor: pieChartBorderColors,
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Enrolled Student by Program' },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login-admin');
  };

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12"> {/* Removed z-[-1] */}
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={
            !loading
              ? {
                  backgroundImage: "url('assets/teacher_vector.png')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right',
                  backgroundSize: 'contain',
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
                <h2 className="text-base text-blue-700 font-semibold">
                  Welcome back,
                </h2>
                <h1 className="text-3xl text-blue-700 font-bold">Administrator</h1>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col md:flex-row flex-nowrap gap-8 justify-center overflow-x-auto">
          <div
            className="bg-white p-4 rounded-lg shadow-md w-full md:w-[50%] min-w-[300px]"
            style={{ minHeight: '350px', position: 'relative' }}
          >
            {lineChartError ? (
              <div className="text-center pt-16 text-red-500 font-semibold">{lineChartError}</div>
            ) : lineLabels.length > 0 && lineCounts.length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div className="text-center pt-16 text-gray-500">Loading attendance chart...</div>
            )}
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