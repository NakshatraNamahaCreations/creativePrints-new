// AddressModal.js
import React, { useState } from "react";

const AddressModal = ({ address, onClose }) => {
  const [firstName, setFirstName] = useState(address?.firstName || "");
  const [lastName, setLastName] = useState(address?.lastName || "");
  const [company, setCompany] = useState(address?.company || "");
  const [phone, setPhone] = useState(address?.phone || "");
  const [street, setStreet] = useState(address?.street || "");
  const [flatNo, setFlatNo] = useState(address?.flatNo || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [pincode, setPincode] = useState(address?.pincode || "");
  const [country, setCountry] = useState(address?.country || "");
  const [isDefaultShipping, setIsDefaultShipping] = useState(
    address?.isDefaultShipping || false
  );
  const [isDefaultBilling, setIsDefaultBilling] = useState(
    address?.isDefaultBilling || false
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      firstName,
      lastName,
      company,
      phone,
      street,
      flatNo,
      city,
      state,
      pincode,
      country,
      isDefaultShipping,
      isDefaultBilling,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <h2 className="text-lg font-semibold mb-4">
          {address ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company (optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country/Region *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="">Select Country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="India">India</option>
              {/* Add more countries as needed */}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="123 Main Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flat, Suite, Unit, Building, Floor, etc. (optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Apt 456 or Floor 3"
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City/Town *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="New York"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP/Postal Code *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="10001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex items-center">
              <input
                id="default-shipping"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={isDefaultShipping}
                onChange={(e) => setIsDefaultShipping(e.target.checked)}
              />
              <label
                htmlFor="default-shipping"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as default shipping address
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="default-billing"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={isDefaultBilling}
                onChange={(e) => setIsDefaultBilling(e.target.checked)}
              />
              <label
                htmlFor="default-billing"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as default billing address
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
              {address ? "Update" : "Add"} Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
