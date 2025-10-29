// PaymentDelivery.js
import React, { useEffect, useState } from 'react';
import PaymentModal from './PaymentModal';
import AddressModal from './AddressModal';

const PaymentDelivery = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

    // ✅ Prevent background scroll when any modal is open
  useEffect(() => {
    if (showPaymentModal || showAddressModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [showPaymentModal, showAddressModal]);

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleCloseModals = () => {
    setShowPaymentModal(false);
    setShowAddressModal(false);
    setEditingPayment(null);
    setEditingAddress(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-semibold text-lg mb-4">Payment & Delivery</h2>
      
      <div className="space-y-6">
        {/* Payment Methods */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Payment Methods</h3>
          <div className="border rounded-lg divide-y divide-gray-200">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 1234</p>
                  <p className="text-xs text-gray-500">Expires 12/2024</p>
                </div>
              </div>
              <button 
                className="text-blue-600 text-sm font-medium"
                onClick={() => handleEditPayment({ type: 'VISA', last4: '1234', expiry: '12/2024' })}
              >
                Edit
              </button>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">MC</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Mastercard ending in 5678</p>
                  <p className="text-xs text-gray-500">Expires 08/2025</p>
                </div>
              </div>
              <button 
                className="text-blue-600 text-sm font-medium"
                onClick={() => handleEditPayment({ type: 'MC', last4: '5678', expiry: '08/2025' })}
              >
                Edit
              </button>
            </div>
            <div className="p-4">
              <button 
                className="text-blue-600 text-sm font-medium flex items-center"
                onClick={handleAddPayment}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
        
        {/* Billing Address */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Billing Address</h3>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-sm text-gray-600">123 Main Street</p>
                <p className="text-sm text-gray-600">New York, NY 10001</p>
                <p className="text-sm text-gray-600">United States</p>
              </div>
              <button 
                className="text-blue-600 text-sm font-medium"
                onClick={() => handleEditAddress({ 
                  name: 'John Doe', 
                  street: '123 Main Street', 
                  city: 'New York', 
                  state: 'NY', 
                  zipCode: '10001', 
                  country: 'United States',
                  isDefaultBilling: true
                })}
              >
                Edit
              </button>
            </div>
            <div className="flex items-center">
              <input id="default-billing" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
              <label htmlFor="default-billing" className="ml-2 block text-sm text-gray-700">Use as default billing address</label>
            </div>
          </div>
        </div>
        
        {/* Delivery Addresses */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Delivery Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium">Home Address</p>
                  <p className="text-sm text-gray-600">123 Main Street</p>
                  <p className="text-sm text-gray-600">New York, NY 10001</p>
                  <p className="text-sm text-gray-600">United States</p>
                </div>
                <button 
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => handleEditAddress({ 
                    name: 'Home Address', 
                    street: '123 Main Street', 
                    city: 'New York', 
                    state: 'NY', 
                    zipCode: '10001', 
                    country: 'United States',
                    isDefaultShipping: true
                  })}
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center">
                <input id="default-delivery-home" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="default-delivery-home" className="ml-2 block text-sm text-gray-700">Default delivery address</label>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium">Office Address</p>
                  <p className="text-sm text-gray-600">456 Business Ave</p>
                  <p className="text-sm text-gray-600">Suite 300</p>
                  <p className="text-sm text-gray-600">New York, NY 10001</p>
                  <p className="text-sm text-gray-600">United States</p>
                </div>
                <button 
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => handleEditAddress({ 
                    name: 'Office Address', 
                    street: '456 Business Ave', 
                    apartment: 'Suite 300',
                    city: 'New York', 
                    state: 'NY', 
                    zipCode: '10001', 
                    country: 'United States',
                    isDefaultShipping: false
                  })}
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center">
                <input id="default-delivery-office" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="default-delivery-office" className="ml-2 block text-sm text-gray-700">Default delivery address</label>
              </div>
            </div>
          </div>
          <button 
            className="mt-4 text-blue-600 text-sm font-medium flex items-center"
            onClick={handleAddAddress}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Address
          </button>
        </div>
        
        {/* Delivery Preferences */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Delivery Preferences</h3>
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-xs text-gray-500">Get notified about delivery status updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS notifications</p>
                <p className="text-xs text-gray-500">Get text messages about delivery status updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
            Save Changes
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          payment={editingPayment} 
          onClose={handleCloseModals} 
        />
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal 
          address={editingAddress} 
          onClose={handleCloseModals} 
        />
      )}
    </div>
  );
};

export default PaymentDelivery;