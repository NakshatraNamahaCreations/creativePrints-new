import React, { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteAccountModal = ({ isOpen, onClose, onDelete }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmationText.toLowerCase() !== "delete") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    setIsLoading(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const deletelistdata = [
    "Your Creative account;",
    "Your order history with any of the Creative signature services;",
    "Your active subscriptions;",
    "Products you have designed and stored and services you have used;",
    "Uploaded images, any stored designs and other content with any of the Creative signature services; and",
    "You will not be able to edit or re-order any products. If you want to order any of our products again, you will have to create a new account and re-design them.",
  ];

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Delete Account</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900">
              Are you sure you want to delete your account?
            </h4>
            <p className="text-gray-700 mb-4">
              You will no longer be able to access any Creative signature service,
              including CreativePrint, CreativeCreate, 99designs by Creative and Creative
              Corporate Solutions, as well as any personal data, losing access to the following:
            </p>
            
            <ul className="bg-gray-50 rounded-md p-4 mb-4">
              {deletelistdata.map((item, index) => (
                <li className="list-disc ml-5 mb-1 text-gray-700" key={index}>
                  {item}
                </li>
              ))}
            </ul>
            
            <p className="text-gray-700 mb-3">
              Please note that we may be required by law to keep certain information
              (for example, records of transactions or shipments) and we may still
              retain anonymous information. We also will maintain a record of this
              deletion request.
            </p>
            
            <p className="text-gray-700 mb-3">
              If you have any outstanding subscriptions or orders, you will be asked
              to cancel your subscriptions and orders before your account can be
              deleted. Additionally, we ask that you please log out of your account
              on all devices using any of the Creative signature services after
              submitting your deletion request.
            </p>
            
            <p className="text-gray-700 mb-4">
              Click "Delete account" if you want to proceed to delete your account.
            </p>
          </div>
          
          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us why you want to delete your account
            </label>
            <select 
              onChange={(e) => setSelectedReason(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedReason}
            >
              <option value="">Select a reason</option>
              <option value="1">I am unhappy with the service</option>
              <option value="2">I have a duplicate account</option>
              <option value="3">
                I am getting too many marketing emails from Creative Print
              </option>
              <option value="4">I no longer need this account</option>
              <option value="5">Other</option>
            </select>
          </div>
          
          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter DELETE here"
            />
          </div>
          
          {/* Warning */}
          <div className="flex items-start gap-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md p-4 mb-6">
            <FiAlertTriangle className="mt-0.5 flex-shrink-0" /> 
            <p className="text-sm">
              Deleting your account is a permanent change and cannot be reversed.
            </p>
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading || confirmationText.toLowerCase() !== "delete" || !selectedReason}
            className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;