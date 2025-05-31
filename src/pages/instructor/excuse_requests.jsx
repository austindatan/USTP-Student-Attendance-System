import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ExcuseRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // For view details modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modal, setModal] = useState({ show: false, id: null, type: '' }); // For confirmation modal (approve/reject/delete)
  const [instructorId, setInstructorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state

  useEffect(() => {
    const storedInstructor = localStorage.getItem("instructor");
    if (storedInstructor) {
      try {
        const instructorData = JSON.parse(storedInstructor);

        if (instructorData && instructorData.instructor_id) {
          setInstructorId(instructorData.instructor_id);
        } else {
          setError("Instructor data in localStorage is incomplete or missing ID. Please log in again.");
          setIsLoading(false); // Set loading to false on error
        }
      } catch (e) {
        setError("Failed to parse instructor data from localStorage. Please log in again.");
        console.error("Error parsing instructor data from localStorage:", e);
        setIsLoading(false); // Set loading to false on error
      }
    } else {
      setError("Instructor not logged in. Please log in to view requests.");
      setIsLoading(false); // Set loading to false if no instructor
    }
  }, []);

  // Modified fetchRequests to accept a parameter controlling skeleton display
  const fetchRequests = (currentInstructorId, showSkeleton = true) => {
    setError(null);
    if (showSkeleton) { // Only show skeleton if explicitly requested
      setIsLoading(true);
    }

    if (!currentInstructorId) {
      console.log("No instructor ID provided, skipping fetch.");
      setError("Cannot fetch requests: Instructor ID is missing.");
      setRequests([]);
      if (showSkeleton) {
        setIsLoading(false); // Set loading to false if no ID and skeleton was requested
      }
      return;
    }

    const MIN_LOADING_TIME_MS = 1300;
    const startTime = showSkeleton ? Date.now() : 0; // Record start time only if skeleton is shown

    // Helper function to handle final state updates and loading toggle
    const finalizeFetch = (data, fetchError = null) => {
      const executeUpdate = () => {
        if (fetchError) {
          console.error("Error fetching requests:", fetchError);
          setError(`Failed to load requests: ${fetchError.message}`);
          setRequests([]);
        } else {
          if (Array.isArray(data)) {
            setRequests(data);
          } else if (data.success === false) {
            setError(data.message || 'No requests found or unexpected error from backend.');
            setRequests([]);
          } else {
            setError('Unexpected response format from backend.'); // Setting error for unexpected format
            setRequests([]); // Clear requests on unexpected format
          }
        }
        if (showSkeleton) { // Only turn off loading if skeleton was used
          setIsLoading(false);
        }
      };

      if (showSkeleton) {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const remainingTime = MIN_LOADING_TIME_MS - elapsedTime;
        setTimeout(executeUpdate, remainingTime > 0 ? remainingTime : 0);
      } else {
        executeUpdate(); // Execute immediately if no skeleton is desired
      }
    };

    fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_excused_req.php?instructor_id=${currentInstructorId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        finalizeFetch(data); // Call helper for success
      })
      .catch(err => {
        finalizeFetch(null, err); // Call helper for error
      });
  };

  useEffect(() => {
    if (instructorId) {
      // On initial page load, show the skeleton
      fetchRequests(instructorId, true);
    }
  }, [instructorId]);

  const openConfirmationModal = (id, type) => {
    setModal({ show: true, id, type });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setModal({ show: false, id: null, type: '' });
    setShowModal(false); // Close view details modal as well
    setSelectedRequest(null);
  };

  const confirmAction = async () => {
    let endpoint = "";
    let method = "";
    let body = {};
    let successMessage = "";
    let errorMessage = "";

    if (modal.type === "approve" || modal.type === "reject") {
      const status = modal.type === "approve" ? "Approved" : "Rejected";
      endpoint = "http://localhost/USTP-Student-Attendance-System/instructor_backend/update_excuse_req.php";
      method = "PUT";
      body = JSON.stringify({ excused_request_id: modal.id, status });
      successMessage = "Status updated successfully!";
      errorMessage = "Failed to update status.";
    } else if (modal.type === "delete") {
      endpoint = "http://localhost/USTP-Student-Attendance-System/instructor_backend/delete_excuse_req.php";
      method = "DELETE";
      body = JSON.stringify({ excused_request_id: modal.id });
      successMessage = "Request deleted successfully!";
      errorMessage = "Failed to delete request.";
    } else {
      // Should not happen if modal.type is correctly set
      console.error("Unknown modal type:", modal.type);
      closeModal();
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const result = await res.json();
      if (result.success) { // Assuming your PHP scripts return { success: true } on success
        alert(successMessage);
        // After a button press, re-fetch without showing the skeleton
        fetchRequests(instructorId, false);
      } else {
        alert(result.message || errorMessage);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
      console.error(error);
    } finally {
      closeModal();
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)] font-dm-sans p-6 bg-red-50">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Requests</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl bg-opacity-90">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-6 border-b-2 border-indigo-600 pb-2">
            Student Excuse Requests
          </h1>

          {isLoading ? ( // Conditional rendering for skeleton loader
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f0f2f5]">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Course
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Details
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.from({ length: 5 }).map((_, index) => ( // Render 5 skeleton rows
                    <tr key={index} className="animate-pulse">
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-center">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-center">
                        <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center text-[#737373] text-lg">
              <p>No excuse requests to display.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f0f2f5]">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Course
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Details
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((req) => (
                    <tr key={req.excused_request_id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                        {req.student_name}
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-sm text-[#737373]">
                        {req.course_name}
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => handleViewDetails(req)}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-xs sm:text-sm"
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
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap text-center text-sm font-medium">
                        {req.status === 'Pending' ? (
                          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => openConfirmationModal(req.excused_request_id, 'approve')}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-[#3CB371] text-white rounded-md hover:bg-[#2E8B57] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-xs sm:text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openConfirmationModal(req.excused_request_id, 'reject')}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-[#DC3545] text-white rounded-md hover:bg-[#C82333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-xs sm:text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-gray-500 text-xs sm:text-sm">Already {req.status}</span>
                            <button
                              onClick={() => openConfirmationModal(req.excused_request_id, 'delete')}
                              className="mt-1 px-2 py-1 bg-gray-300 text-red-600 rounded hover:bg-gray-400 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && selectedRequest && createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full mx-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-600">Excuse Request Details</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-[#737373]">
                <p><strong>Date Requested:</strong> {selectedRequest.date_requested}</p>
                <p><strong>Date of Absence:</strong> {selectedRequest.date_of_absence}</p>

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
                      href={`http://localhost/USTP-Student-Attendance-System/${selectedRequest.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 text-indigo-600 rounded-lg shadow-md hover:bg-gray-200 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm sm:text-base font-semibold border border-indigo-200"
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

        {modal.show && createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 text-center">Confirm Action</h2>
              </div>
              <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                Are you sure you want to <strong>{modal.type}</strong> this excuse request?
              </p>
              <div className="flex justify-end space-x-2 sm:space-x-3">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  Confirm
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

export default ExcuseRequestsPage;