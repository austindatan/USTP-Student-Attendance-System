import React from 'react';

export default function MessageModal({ isOpen, onClose, title, message, type = 'info' }) {
    if (!isOpen) return null;

    let borderColor = 'border-blue-500';
    let textColor = 'text-blue-700';
    let buttonBg = 'bg-blue-600';
    let buttonHoverBg = 'hover:bg-blue-700';

    if (type === 'error') {
        borderColor = 'border-red-500';
        textColor = 'text-red-700';
        buttonBg = 'bg-red-600';
        buttonHoverBg = 'hover:bg-red-700';
    } else if (type === 'success') {
        borderColor = 'border-green-500';
        textColor = 'text-green-700';
        buttonBg = 'bg-green-600';
        buttonHoverBg = 'hover:bg-green-700';
    } else if (type === 'warning') { 
        borderColor = 'border-yellow-500';
        textColor = 'text-yellow-700';
        buttonBg = 'bg-yellow-600';
        buttonHoverBg = 'hover:bg-yellow-700';
    }


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 font-inter">
            <div className={`bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full border-t-4 ${borderColor} transform transition-all ease-out duration-300 scale-100 opacity-100`}>
                <h2 className={`text-xl font-bold mb-4 ${textColor}`}>{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-md text-white font-semibold shadow-md transition-colors duration-200 ${buttonBg} ${buttonHoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
