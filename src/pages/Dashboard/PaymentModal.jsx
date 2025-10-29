// PaymentModal.js
import React, { useState } from 'react';

const PaymentModal = ({ payment, onClose }) => {
  const [cardNumber, setCardNumber] = useState(payment?.last4 ? `**** **** **** ${payment.last4}` : '');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState(payment?.expiry || '');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ cardNumber, cardholderName, expiryDate, cvv, isDefault });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {payment ? 'Edit Payment Method' : 'Add Payment Method'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="default-payment"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <label htmlFor="default-payment" className="ml-2 block text-sm text-gray-700">
                Set as default payment method
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {payment ? 'Update' : 'Add'} Payment Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;