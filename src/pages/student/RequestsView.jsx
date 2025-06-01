// StudentExcuseRequestsTable.js
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StudentExcuseRequestsTable = ({ studentId }) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [noRequestsMessage, setNoRequestsMessage] = useState('');

  const navigate = useNavigate(); // Initialize navigate hook

  const fetchStudentRequests = async () => {
    setError(null);
    setNoRequestsMessage('');
    setIsLoading(true);

    if (!studentId) {
      console.log("No student ID provided, skipping fetch.");
      setError("Cannot fetch requests: Student ID is missing.");
      setRequests([]);
      setIsLoading(false);
      return;
    }

    const MIN_LOADING_TIME_MS = 500;
    const startTime = Date.now();

    try {
      const res = await axios.get(
        `http://localhost/ustp-student-attendance-system/api/student-backend/GetStudent_ExcuseRequests.php?student_id=${studentId}`
      );

      const data = res.data;

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const remainingTime = MIN_LOADING_TIME_MS - elapsedTime;

      setTimeout(() => {
        if (data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
          setError(null);
          setNoRequestsMessage('');
        } else if (data.success === false) {
          setRequests([]);
          setNoRequestsMessage(data.message || 'No excuse requests found for this student.');
          setError(null);
        } else {
          setRequests([]);
          setError('Unexpected response format from backend.');
          setNoRequestsMessage('');
        }
        setIsLoading(false);
      }, remainingTime > 0 ? remainingTime : 0);

    } catch (err) {
      console.error("Error fetching student requests:", err);
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const remainingTime = MIN_LOADING_TIME_MS - elapsedTime;

      setTimeout(() => {
        setError("Failed to load your excuse requests. Please try again.");
        setRequests([]);
        setNoRequestsMessage('');
        setIsLoading(false);
      }, remainingTime > 0 ? remainingTime : 0);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentRequests();
    }
  }, [studentId]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  // Function to handle navigation to the add request page
  const handleAddRequest = () => {
    navigate('/add-excuse-request');
  };

  if (error && requests.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)] font-dm-sans p-6 bg-red-50">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Requests</h2>
          <p>{error}</p>
          <button
            onClick={fetchStudentRequests}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-dm-sans min-h-screen overflow-y-auto">
      <section className="lg:w-[75%] xl:w-[76%] w-full pt-12 px-6 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl bg-opacity-90">
          {/* Flex container for the title and the button */}
          <div className="flex justify-between items-center mb-6 border-b-2 border-blue-600 pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
              My Excuse Requests
            </h1>
            <button
              onClick={handleAddRequest}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm sm:text-base flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Request
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f0f2f5]">
                <tr>
                  <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                    Date of Absence
                  </th>
                  <th className="py-3 px-3 sm:px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    Details
                  </th>
                  <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-center">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                    </tr>
                  ))
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.excused_request_id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {req.course_name}
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-sm text-[#737373]">
                        {req.date_of_absence}
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => handleViewDetails(req)}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-xs sm:text-sm"
                        >
                          View
                        </button>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-3 px-3 sm:px-4 whitespace-nowrap text-sm text-gray-500 text-center italic">
                      {noRequestsMessage || 'No excuse requests found for this student.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Modal */}
        {showModal && selectedRequest && createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full mx-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-600">Excuse Request Details</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-[#737373]">
                <p><strong>Course:</strong> {selectedRequest.course_name}</p>
                <p><strong>Instructor:</strong> {selectedRequest.instructor_name}</p>
                <p><strong>Date Requested:</strong> {selectedRequest.date_requested}</p>
                <p><strong>Date of Absence:</strong> {selectedRequest.date_of_absence}</p>
                <p><strong>Current Status:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedRequest.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>{selectedRequest.status}</span></p>


                <div className="pt-2">
                  <p className="font-bold mb-1 sm:mb-2 text-[#737373] text-sm sm:text-base">Reason:</p>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-200 max-h-40 sm:max-h-48 overflow-y-auto shadow-inner text-xs sm:text-base leading-relaxed">
                    <p className="whitespace-pre-wrap">{selectedRequest.reason}</p>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4">
                  <p className="font-bold mb-1 sm:mb-2 text-[#737373] text-sm sm:text-base">Attachment:</p>
                  {selectedRequest.file_path ? (
                    <a
                      href={`http://localhost/ustp-student-attendance-system/api/student-backend/${selectedRequest.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 text-blue-600 rounded-lg shadow-md hover:bg-gray-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm sm:text-base font-semibold border border-blue-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Attachment
                    </a>
                  ) : (
                    <span className="text-gray-600 italic text-sm sm:text-base">No attachment uploaded.</span>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </section>
    </div>
  );
};

export default StudentExcuseRequestsTable;