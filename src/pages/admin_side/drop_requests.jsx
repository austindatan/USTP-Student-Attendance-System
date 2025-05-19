import React, { useEffect, useState } from "react";

export default function DropRequests() {
  const [requests, setRequests] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: null, id: null });

  useEffect(() => {
    fetch("http://localhost/ustp-student-attendance-system/src/drop_request_api.php")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error("Failed to fetch:", err));
  }, []);

  const openModal = (type, id) => {
    setModal({ isOpen: true, type, id });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, id: null });
  };

  const confirmAction = () => {
    if (modal.type === "drop") {
      setRequests(prev => prev.filter(req => req.id !== modal.id));
    } else if (modal.type === "reject") {
      setRequests(prev => prev.filter(req => req.id !== modal.id));
    }
    closeModal();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 md:p-10"
      style={{ backgroundImage: "url('assets/white_theme.png')" }}
    >
      <div className="max-w-6xl mx-auto bg-white border-2 border-[#E55182] rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#E55182] mb-6">Drop Requests</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-pink-900 border-collapse">
            <thead className="bg-pink-100 text-pink-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="bg-white border-b hover:bg-pink-50">
                  <td className="px-6 py-4">{req.student_name}</td>
                  <td className="px-6 py-4">{req.course}</td>
                  <td className="px-6 py-4">{req.reason}</td>
                  <td className="px-6 py-4">{req.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openModal("drop", req.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Drop
                    </button>
                    <button
                      onClick={() => openModal("reject", req.id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
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
          </div>
        </div>
      )}
    </div>
  );
}
