import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ExcuseRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modal, setModal] = useState({ show: false, id: null, type: '' });
  const [instructorId, setInstructorId] = useState(null);

  useEffect(() => {
    const storedInstructor = localStorage.getItem("instructor");
    if (storedInstructor) {
      try {
        const instructorData = JSON.parse(storedInstructor); 
        if (instructorData && instructorData.instructor_id) {
          setInstructorId(instructorData.instructor_id);
        } else {
          setError("Instructor data in localStorage is incomplete or missing ID. Please log in again.");
        }
      } catch (e) {
        setError("Failed to parse instructor data from localStorage. Please log in again.");
        console.error("Error parsing instructor data from localStorage:", e);
      }
    } else {
      setError("Instructor not logged in. Please log in to view requests.");
    }
  }, []);

  const fetchRequests = (currentInstructorId) => {
    setError(null);
    if (!currentInstructorId) {
      console.log("No instructor ID provided, skipping fetch.");
      setError("Cannot fetch requests: Instructor ID is missing.");
      setRequests([]);
      return;
    }

    fetch(`http://localhost/USTP-Student-Attendance-System/instructor_backend/get_excused_req.php?instructor_id=${currentInstructorId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data.success === false) {
          setError(data.message || 'No requests found or unexpected error from backend.');
          setRequests([]);
        } else {
          throw new Error('Unexpected response format from backend.');
        }
      })
      .catch(err => {
        console.error("Error fetching requests:", err);
        setError(`Failed to load requests: ${err.message}`);
        setRequests([]);
      });
  };

  useEffect(() => {
    if (instructorId) { 
      fetchRequests(instructorId);
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
    setShowModal(false);
    setSelectedRequest(null);
  };

  const confirmAction = async () => {
    if (modal.type === "approve" || modal.type === "reject") {
      const status = modal.type === "approve" ? "Approved" : "Rejected";

      try {
        const res = await fetch(
          "http://localhost/USTP-Student-Attendance-System/instructor_backend/update_excuse_req.php",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ excused_request_id: modal.id, status }),
          }
        );

        const result = await res.json();
        if (result.error) {
          alert("Failed to update status.");
        } else {
          fetchRequests(instructorId); 
        }
      } catch (error) {
        alert("An error occurred while updating the request.");
        console.error(error);
      } finally {
        closeModal();
      }
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
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl bg-opacity-90">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6 border-b-2 border-indigo-600 pb-2">
            Student Excuse Requests
          </h1>

          {requests.length === 0 ? (
            <div className="p-6 text-center text-[#737373] text-lg">
              <p>No excuse requests to display.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f0f2f5]">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Course
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Details
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((req) => (
                    <tr key={req.excused_request_id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                        {req.student_name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-[#737373]">
                        {req.course_name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => handleViewDetails(req)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                          View
                        </button>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">

                        {req.status === 'Pending' ? (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openConfirmationModal(req.excused_request_id, 'approve')}
                              className="px-3 py-1 bg-[#3CB371] text-white rounded-md hover:bg-[#2E8B57] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openConfirmationModal(req.excused_request_id, 'reject')}
                              className="px-3 py-1 bg-[#DC3545] text-white rounded-md hover:bg-[#C82333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (

                          <span className="text-gray-500">Already {req.status}</span>
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto" onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-indigo-600">Excuse Request Details</h3>
              </div>
              <div className="space-y-3 text-lg text-[#737373]">
                <p><strong>Date Requested:</strong> {selectedRequest.date_requested}</p>
                <p><strong>Date of Absence:</strong> {selectedRequest.date_of_absence}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}


        {modal.show && createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto" onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-indigo-600 text-center">Confirm Action</h2>
              </div>
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to <strong>{modal.type}</strong> this excuse request?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
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