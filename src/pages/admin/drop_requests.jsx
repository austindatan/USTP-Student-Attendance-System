import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Import createPortal

export default function DropRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, id: null });
  const [selectedReason, setSelectedReason] = useState("");
  // State to control viewing history (includes Dropped and Rejected)
  const [showHistory, setShowHistory] = useState(false); // This state will now represent 'Dropped'
  // State to control viewing explicitly rejected requests
  const [showRejected, setShowRejected] = useState(false);

  // State for "Student Dropped Successfully" modal
  const [showDropSuccessModal, setShowDropSuccessModal] = useState(false);
  // State for "Request Rejected Successfully" modal
  const [showRejectSuccessModal, setShowRejectSuccessModal] = useState(false);

  // Modified fetchRequests to accept a parameter for the view type
  const fetchRequests = (viewType) => { // Renamed from isHistoryView to viewType
    setLoading(true);
    setError(null); // Clear previous errors when starting a new fetch

    let url = `http://localhost/ustp-student-attendance-system/api/admin_backend/get_drop_req.php?view=`;

    if (viewType === 'dropped') { // Changed 'history' to 'dropped' here
      url += 'history'; // Fetches both 'Dropped' and 'Rejected' from history table
    } else if (viewType === 'rejected') {
      url += 'rejected'; // Will fetch explicitly 'Rejected' from history table or original table
    } else { // 'active'
      url += 'active'; // Fetches 'Pending' requests
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data.error) {
          setError(
            data.error || "No requests found or unexpected error from backend."
          );
          setRequests([]);
        } else {
          throw new Error("Unexpected response format from backend.");
        }
      })
      .catch((err) => {
        console.error("Error fetching drop requests:", err);
        setError(`Failed to load requests: ${err.message}`);
        setRequests([]); // Clear requests on error
      })
      .finally(() => setLoading(false));
  };

  // useEffect now depends on showHistory (now 'Dropped' view) and showRejected to re-fetch data
  useEffect(() => {
    if (showHistory) { // This now means 'Dropped' view is active
      fetchRequests('dropped'); // Fetch 'dropped' history
    } else if (showRejected) {
      fetchRequests('rejected'); // Fetch 'rejected' history
    } else {
      fetchRequests('active'); // Fetch active requests
    }
  }, [showHistory, showRejected]); // Re-run effect when showHistory or showRejected changes

  const openModal = (type, id, reason = "") => {
    setModal({ isOpen: true, type, id });
    if (type === "reason") setSelectedReason(reason);
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, id: null });
    setSelectedReason("");
  };

  const confirmAction = async () => {
    if (modal.type === "drop" || modal.type === "reject") {
      const status = modal.type === "drop" ? "Dropped" : "Rejected";

      try {
        const res = await fetch(
          "http://localhost/ustp-student-attendance-system/api/admin_backend/update_drop_req.php",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drop_request_id: modal.id, status }),
          }
        );

        const result = await res.json();
        if (result.error) {
          alert(`Failed to perform action: ${result.error}`);
        } else {
          if (modal.type === "drop") {
            setShowDropSuccessModal(true);
            setShowHistory(true); // Switch to 'Dropped' view
            setShowRejected(false); // Ensure Rejected view is off
          } else if (modal.type === "reject") {
            setShowRejectSuccessModal(true); // Show reject success modal
            setShowRejected(true); // Switch to explicitly rejected view
            setShowHistory(false); // Ensure Dropped view is off
          }
          // The useEffect will handle the re-fetch because showHistory or showRejected changed.
        }
      } catch (error) {
        alert("An error occurred while performing the action.");
        console.error("Action error:", error);
      } finally {
        closeModal();
      }
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      (req.student_name &&
        req.student_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.reason && req.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex"
      style={{ overflowY: "auto" }}
    >
      <section className="w-full pt-12 px-4 sm:px-6 md:px-12 mb-12">
        <div
          className="bg-white rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={
            !loading
              ? {
                  backgroundImage: "url('assets/teacher_vector.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right",
                  backgroundSize: "contain",
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
              <h1 className="text-2xl text-blue-700 font-bold">
                {showHistory ? "Dropped Students" : showRejected ? "Rejected Requests" : "Drop Requests"}
              </h1>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p className="text-center text-gray-500">
              Loading {showHistory ? "dropped students" : showRejected ? "rejected requests" : "drop requests"}...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                <p className="text-blue-700 font-semibold">
                  Total {showHistory ? "Dropped Records" : showRejected ? "Rejected Records" : "Requests"}:{" "}
                  {filteredRequests.length}
                </p>
                {/* Buttons to switch between Active, Dropped, and Rejected views */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowHistory(false);
                      setShowRejected(false);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !showHistory && !showRejected
                        ? "bg-blue-600 text-white" // Active state
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300" // Inactive state
                    }`}
                  >
                    Active Requests
                  </button>
                  <button
                    onClick={() => {
                      setShowHistory(true);
                      setShowRejected(false);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      showHistory && !showRejected
                        ? "bg-blue-600 text-white" // Active state
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300" // Inactive state
                    }`}
                  >
                    Dropped {/* Renamed from History to Dropped */}
                  </button>
                  {/* Rejected Button */}
                  <button
                    onClick={() => {
                      setShowRejected(true);
                      setShowHistory(false);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      showRejected
                        ? "bg-blue-600 text-white" // Active state
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300" // Inactive state
                    }`}
                  >
                    Rejected
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search students or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
                />
              </div>

              <div
                className="overflow-x-auto"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                  <thead className="bg-blue-100 uppercase text-blue-700">
                    <tr>
                      {/* Conditionally display Student ID for active requests only */}
                      {!showHistory && !showRejected && <th className="px-4 py-2">Student ID</th>}
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Program</th>
                      <th className="px-4 py-2">Course</th>
                      <th className="px-4 py-2">Instructor</th>
                      <th className="px-4 py-2">Reason</th>
                      <th className="px-4 py-2">Status</th>
                      {/* Display Processed At only for dropped/rejected view */}
                      {(showHistory || showRejected) && <th className="px-4 py-2">Processed At</th>}
                      {/* Action column only for active requests */}
                      {!showHistory && !showRejected && <th className="px-4 py-2">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={!showHistory && !showRejected ? 8 : 7} // Adjust colspan based on view
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          {showHistory
                            ? "No dropped students found." // Updated text
                            : showRejected
                            ? "No rejected requests found."
                            : "No active drop requests found."}
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr
                          key={req.drop_request_id}
                          className="border-b border-blue-200 hover:bg-blue-50"
                        >
                          {/* Conditionally display Student ID for active requests */}
                          {!showHistory && !showRejected && (
                            <td className="px-4 py-2">{req.student_id}</td>
                          )}
                          <td className="px-4 py-2 truncate max-w-[140px]">
                            {req.student_name}
                          </td>
                          <td className="px-4 py-2 truncate max-w-[120px]">
                            {req.program_name}
                          </td>
                          <td className="px-4 py-2 truncate max-w-[140px]">
                            {req.course_name}
                          </td>
                          <td className="px-4 py-2 truncate max-w-[140px]">
                            {req.instructor_name}
                          </td>
                          <td className="px-4 py-2 max-w-xs">
                            <div
                              onClick={() =>
                                openModal("reason", req.drop_request_id, req.reason)
                              }
                              className="cursor-pointer text-blue-600 hover:underline line-clamp-1"
                              title="Click to view full reason"
                            >
                              {req.reason}
                            </div>
                          </td>
                          <td className="px-4 py-2">{req.status}</td>
                          {/* Display Processed At only for dropped/rejected view */}
                          {(showHistory || showRejected) && (
                            <td className="px-4 py-2">
                              {req.dropped_at // Assuming 'dropped_at' is used for both dropped and rejected timestamps in history
                                ? new Date(req.dropped_at).toLocaleString()
                                : "N/A"}
                            </td>
                          )}
                          {/* Action buttons only for active requests */}
                          {!showHistory && !showRejected && (
                            <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                              {/* Only show 'Drop'/'Reject' buttons if status is 'Pending' */}
                              {req.status === "Pending" ? (
                                <>
                                  <button
                                    onClick={() => openModal("drop", req.drop_request_id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                  >
                                    Drop
                                  </button>
                                  <button
                                    onClick={() => openModal("reject", req.drop_request_id)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-500">Already {req.status}</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {modal.isOpen &&
          createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                {modal.type === "reason" ? (
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-blue-700">
                      Drop Reason
                    </h2>
                    <p className="mb-6 text-gray-700 whitespace-pre-wrap">
                      {selectedReason}
                    </p>
                    <button
                      onClick={closeModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold mb-4">
                      {modal.type === "drop"
                        ? "Are you sure you want to drop this student?"
                        : "Are you sure you want to reject this drop request?"}
                    </h2>
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={confirmAction}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Yes
                      </button>
                      <button
                        onClick={closeModal}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>,
            document.body
          )}

        {/* Student Dropped Successfully Modal */}
        {showDropSuccessModal &&
          createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
              onClick={() => setShowDropSuccessModal(false)}
            >
              <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
                    Success!
                  </h2>
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                  Student successfully dropped.
                </p>
                <div className="flex justify-end space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setShowDropSuccessModal(false)}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Request Rejected Successfully Modal */}
        {showRejectSuccessModal &&
          createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
              onClick={() => setShowRejectSuccessModal(false)}
            >
              <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center items-center mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
                    Success!
                  </h2>
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                  Drop request successfully rejected.
                </p>
                <div className="flex justify-end space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setShowRejectSuccessModal(false)}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </section>
    </div>
  );
}