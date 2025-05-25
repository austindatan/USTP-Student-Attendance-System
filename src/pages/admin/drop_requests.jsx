import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DropRequests() {
  const [requests, setRequests] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: null, id: null });
  const [selectedReason, setSelectedReason] = useState("");
  const navigate = useNavigate();

  const fetchRequests = () => {
    fetch("http://localhost/USTP-Student-Attendance-System/admin_backend/get_drop_req.php")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Failed to fetch:", err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
        const res = await fetch("http://localhost/USTP-Student-Attendance-System/admin_backend/update_drop_req.php", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ drop_request_id: modal.id, status }),
        });

        const result = await res.json();
        if (result.error) {
          alert("Failed to update status.");
        } else {
          fetchRequests(); // refresh list
        }
      } catch (error) {
        console.error("Error updating drop request:", error);
        alert("An error occurred while updating the request.");
      } finally {
        closeModal();
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 md:p-10"
      style={{ backgroundImage: "url('assets/white_theme.png')" }}
    >
      <div className="max-w-6xl mx-auto bg-white border-2 border-[#E55182] rounded-xl shadow-xl p-8">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="mb-4 bg-[#E55182] text-white px-4 py-2 rounded hover:bg-[#c0406d]"
        >
          ← Go Back
        </button>

        <h1 className="text-3xl font-bold text-[#E55182] mb-6">Drop Requests</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-pink-900 border-collapse">
            <thead className="bg-pink-100 text-pink-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Program</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Instructor</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.drop_request_id} className="bg-white border-b hover:bg-pink-50">
                  <td className="px-6 py-4">{req.student_name}</td>
                  <td className="px-6 py-4">{req.program_name}</td>
                  <td className="px-6 py-4">{req.course_name}</td>
                  <td className="px-6 py-4">{req.instructor_name}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div
                      onClick={() => openModal("reason", req.drop_request_id, req.reason)}
                      className="cursor-pointer text-blue-600 hover:underline line-clamp-1"
                    >
                      {req.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4">{req.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openModal("drop", req.drop_request_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                    No drop requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            {modal.type === "reason" ? (
              <>
                <h2 className="text-lg font-semibold mb-4 text-pink-700">Drop Reason</h2>
                <p className="mb-6 text-gray-700">{selectedReason}</p>
                <button
                  onClick={closeModal}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
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
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
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
    </div>
  );
}
