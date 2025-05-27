import React, { useEffect, useState } from "react";

export default function DropRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, id: null });
  const [selectedReason, setSelectedReason] = useState("");

  // Fetch drop requests from API
  const fetchRequests = () => {
    setLoading(true);
    fetch("http://localhost/ustp-student-attendance-system/admin_backend/get_drop_req.php")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setError(null);
      })
      .catch(() => setError("Failed to fetch drop requests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Open modal with type and id; if reason, set selectedReason too
  const openModal = (type, id, reason = "") => {
    setModal({ isOpen: true, type, id });
    if (type === "reason") setSelectedReason(reason);
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, id: null });
    setSelectedReason("");
  };

  // Confirm Drop or Reject action
  const confirmAction = async () => {
    if (modal.type === "drop" || modal.type === "reject") {
      const status = modal.type === "drop" ? "Dropped" : "Rejected";

      try {
        const res = await fetch(
          "http://localhost/ustp-student-attendance-system/admin_backend/update_drop_req.php",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drop_request_id: modal.id, status }),
          }
        );

        const result = await res.json();
        if (result.error) {
          alert("Failed to update status.");
        } else {
          fetchRequests();
        }
      } catch (error) {
        alert("An error occurred while updating the request.");
        console.error(error);
      } finally {
        closeModal();
      }
    }
  };

  // Filter requests by student name or reason
  const filteredRequests = requests.filter(
    (req) =>
      req.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-dm-sans bg-cover bg-center bg-fixed min-h-screen flex hide-scrollbar overflow-scroll">
      <section className="w-full pt-12 px-6 sm:px-6 md:px-12 mb-12 z-[-1]">

      {/* Header */}
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
                <h1 className="text-2xl text-blue-700 font-bold">Drop Requests</h1>
            </>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading drop requests...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <p className="text-blue-700 font-semibold">
                Total Requests: {filteredRequests.length}
              </p>
              <input
                type="text"
                placeholder="Search students... "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[250px]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-blue-900 border-collapse">
                <thead className="bg-blue-100 uppercase text-blue-700">
                  <tr>
                    <th className="px-4 py-2">Student ID</th>
                    <th className="px-4 py-2">Student Name</th>
                    <th className="px-4 py-2">Program</th>
                    <th className="px-4 py-2">Course</th>
                    <th className="px-4 py-2">Instructor</th>
                    <th className="px-4 py-2">Reason</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No drop requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr
                        key={req.drop_request_id}
                        className="border-b border-blue-200 hover:bg-blue-50"
                      >
                        <td className="px-4 py-2">{req.student_id}</td>
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
                        <td className="px-4 py-2 space-x-2 whitespace-nowrap">
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
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
