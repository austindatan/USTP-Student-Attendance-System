import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login-admin');
  };

  const goToDropRequests = () => {
    navigate('/drop_requests');
  };

  const goToStudents = () => {
    navigate('/admin-students');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to the Admin Dashboard</h1>
      <p className="mt-4 text-gray-700">You have successfully logged in as admin.</p>

      <button
        onClick={goToStudents}
        className="mt-6 mr-4 bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
      >
        Students
      </button>

      <button
        onClick={goToDropRequests}
        className="mt-6 mr-4 bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
      >
        Drop Requests
      </button>

      <button
        onClick={handleLogout}
        className="mt-6 bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;