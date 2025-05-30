import React from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-blue-700 hover:bg-blue-800', 
  cancelButtonClass = 'bg-gray-200 text-gray-800 hover:bg-gray-300', 
  titleClass = 'text-blue-700', 
  loading = false,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="font-dm-sans fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"

    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm border border-gray-300"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className={`text-xl font-bold mb-4 ${titleClass}`}>{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded transition-colors duration-200 ${cancelButtonClass}`}
            disabled={loading} 
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded transition-colors duration-200 ${confirmButtonClass} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading} 
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}