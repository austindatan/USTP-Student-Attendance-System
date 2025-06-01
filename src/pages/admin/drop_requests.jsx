import React, { useEffect, useState } from "react";

export default function DropRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, id: null });
  const [selectedReason, setSelectedReason] = useState("");
  // New state to control viewing history
  const [showHistory, setShowHistory] = useState(false); // false for active requests, true for dropped history

  // Modified fetchRequests to accept a parameter for the view type
  const fetchRequests = (isHistoryView) => {
    setLoading(true);
    setError(null); // Clear previous errors when starting a new fetch

    // Construct the URL based on whether history view is active
    const url = `http://localhost/USTP-Student-Attendance-System/admin_backend/get_drop_req.php?view=${
      isHistoryView ? "history" : "active"
    }`;

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
          // Assuming your PHP might return {error: "..."}
          setError(
            data.error || "No requests found or unexpected error from backend."
          );
          setRequests([]);
        } else {
          // Fallback for unexpected non-array response
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

  // useEffect now depends on showHistory to re-fetch data
  useEffect(() => {
    fetchRequests(showHistory);
  }, [showHistory]); // Re-run effect when showHistory changes

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
          "http://localhost/USTP-Student-Attendance-System/admin_backend/update_drop_req.php",
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
          alert(result.message || "Action successful!");
          fetchRequests(showHistory); // Re-fetch based on current view after action
        }
      } catch (error) {
        alert("An error occurred while performing the action.");
        console.error("Action error:", error);
      } finally {
        closeModal();
      }
    }
  };

  // Simplified filtering: now that backend filters by view, we only search within the fetched data
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
                {showHistory ? "Drop History" : "Drop Requests"}
              </h1>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p className="text-center text-gray-500">
              Loading {showHistory ? "history" : "drop requests"}...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                <p className="text-blue-700 font-semibold">
                  Total {showHistory ? "History Records" : "Requests"}:{" "}
                  {filteredRequests.length}
                </p>
                {/* Buttons to switch between Active and History views */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHistory(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !showHistory
                        ? "bg-blue-600 text-white" // Active state
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300" // Inactive state
                    }`}
                  >
                    Active Requests
                  </button>
                  <button
                    onClick={() => setShowHistory(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      showHistory
                        ? "bg-blue-600 text-white" // Active state
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300" // Inactive state
                    }`}
                  >
                    History
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
                      {!showHistory && <th className="px-4 py-2">Student ID</th>}
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Program</th>
                      <th className="px-4 py-2">Course</th>
                      <th className="px-4 py-2">Instructor</th>
                      <th className="px-4 py-2">Reason</th>
                      <th className="px-4 py-2">Status</th>
                      {/* Display Dropped At only for history view */}
                      {showHistory && <th className="px-4 py-2">Dropped At</th>}
                      {/* Action column only for active requests */}
                      {!showHistory && <th className="px-4 py-2">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={showHistory ? 7 : 8} // Adjust colspan based on view
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          {showHistory
                            ? "No historical drop requests found."
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
                          {!showHistory && (
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
                          {/* Display Dropped At only for history view */}
                          {showHistory && (
                            <td className="px-4 py-2">
                              {req.dropped_at
                                ? new Date(req.dropped_at).toLocaleString()
                                : "N/A"}
                            </td>
                          )}
                          {/* Action buttons only for active requests */}
                          {!showHistory && (
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

        {modal.isOpen && (
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
          </div>
        )}
      </section>
    </div>
  );
}