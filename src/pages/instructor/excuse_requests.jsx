// src/pages/instructor/ExcuseRequestsPage.jsx
import React, { useState } from 'react';

const ExcuseRequestsPage = () => {
    const initialRequests = [
        {
            excused_request_id: 101,
            student_id: 'S001',
            student_name: 'Alice Johnson',
            course: 'Information Management',
            date_of_request: 'May 18, 2025',
            date_absent: 'May 20, 2025',
            reason: 'Medical appointment',
            status: 'Approved',
        },
        {
            excused_request_id: 102,
            student_id: 'S002',
            student_name: 'Bob Williams',
            course: 'Web Systems and Technologies',
            date_of_request: 'May 19, 2025',
            date_absent: 'May 21, 2025',
            reason: 'Family emergency, out of town',
            status: 'Pending',
        },
        {
            excused_request_id: 103,
            student_id: 'S003',
            student_name: 'Charlie Brown',
            course: 'Information Management',
            date_of_request: 'May 17, 2025',
            date_absent: 'May 20, 2025',
            reason: 'Attending a school-related competition',
            status: 'Approved',
        },
        {
            excused_request_id: 104,
            student_id: 'S004',
            student_name: 'Diana Miller',
            course: 'Web Systems and Technologies',
            date_of_request: 'May 20, 2025',
            date_absent: 'May 22, 2025',
            reason: 'Fever and body aches',
            status: 'Pending',
        },
        {
            excused_request_id: 105,
            student_id: 'S005',
            student_name: 'Eve Davis',
            course: 'Information Management',
            date_of_request: 'May 21, 2025',
            date_absent: 'May 23, 2025',
            reason: 'Dentist appointment, root canal',
            status: 'Rejected',
        },
    ];

    const [requests, setRequests] = useState(initialRequests);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleStatusChange = (id, newStatus) => {
        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.excused_request_id === id ? { ...req, status: newStatus } : req
            )
        );
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
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
        <div className="font-dm-sans p-6 min-h-[calc(100vh-80px)]">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl bg-opacity-90">
                <h1 className="text-3xl font-bold text-[#0097b2] mb-6 border-b-2 border-[#0097b2] pb-2">
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
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-[#0097b2] font-medium">{req.student_name}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-[#737373]">{req.course}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-center text-sm">
                                            <button
                                                onClick={() => handleViewDetails(req)}
                                                className="px-3 py-1 bg-[#0097b2] text-white rounded-md hover:bg-[#0097b2] focus:outline-none focus:ring-2 focus:ring-[#1F27A6] focus:ring-opacity-50 transition duration-150 ease-in-out"
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
                                                        onClick={() => handleStatusChange(req.excused_request_id, 'Approved')}
                                                        className="px-3 py-1 bg-[#3CB371] text-white rounded-md hover:bg-[#2E8B57] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(req.excused_request_id, 'Rejected')}
                                                        className="px-3 py-1 bg-[#DC3545] text-white rounded-md hover:bg-[#C82333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic">No actions needed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-[#0097b2]">Excuse Request Details</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                                &times;
                            </button>
                        </div>
                        <div className="space-y-3 text-lg text-[#737373]">
                            <p><strong>Date Requested:</strong> {selectedRequest.date_of_request}</p>
                            <p><strong>Date of Absence:</strong> {selectedRequest.date_absent}</p>
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
                </div>
            )}
        </div>
    );
};

export default ExcuseRequestsPage;