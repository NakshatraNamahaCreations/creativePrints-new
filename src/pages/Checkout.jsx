import React, { useState } from "react";
import ProjectImageCarousel from "../components/ProjectImageCarousel";
import AddressModal from "./Dashboard/AddressModal";
import { TbTruckDelivery } from "react-icons/tb";

const addresses = [
  {
    id: "1",
    label: "nnc company",
    name: "Nakshatra Namaha Creations",
    address:
      "#374, Dwaraka Nagar, Channasandra Near Yuva Hardware, Bengaluru, Karnataka 560098, India",
    phone: "63646828146",
    default: true,
  },
  {
    id: "2",
    label: "Office Address",
    name: "Nakshatra Namaha Creations",
    address: "MG Road, Bengaluru, Karnataka 560001, India",
    phone: "9876543210",
    default: false,
  },
];

const deliverySpeeds = [
  {
    id: "standard",
    label: "Standard",
    desc: "Estimated arrival by 8 September",
    price: 0,
  },
  {
    id: "express",
    label: "Express",
    desc: "Delivered within 2-3 days",
    price: 150,
  },
];

const items = [
  {
    id: 1,
    name: "Standard Visiting Cards",
    qty: 300,
    price: 930,
    images: [
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
      "https://i.pinimg.com/736x/26/84/e7/2684e78ec374a7adde58e191e3980fbb.jpg",
    ],
  },
  {
    id: 2,
    name: "Personalised Notebooks",
    qty: 5,
    price: 1500,
    images: [
      "https://i.pinimg.com/736x/26/84/e7/2684e78ec374a7adde58e191e3980fbb.jpg",
      "https://i.pinimg.com/736x/fe/f0/ca/fef0ca668799471d75e23436b6a1c9e6.jpg",
    ],
  },
];

const Checkout = () => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [savedAddress, setSavedAddress] = useState(addresses[0]);
  const [selectedSpeed, setSelectedSpeed] = useState("standard");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSaveAddress = () => {
    const addr = addresses.find((a) => a.id === selectedAddress);
    setSavedAddress(addr);
    setIsEditingAddress(false);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleCloseModals = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Left Side */}
      <div className="md:col-span-3 space-y-6">
        {/* Shipping */}
        <div className="rounded-lg bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-3">Shipping</h2>

          {!isEditingAddress ? (
            <>
              {/* Default address view */}
              <div className="text-sm text-gray-700 mb-2">
                <p className="font-medium">{savedAddress.label}</p>
                <p>{savedAddress.name}</p>
                <p>{savedAddress.address}</p>
                <p>{savedAddress.phone}</p>
              </div>
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-blue-600 text-sm font-medium mb-4"
              >
                Change address
              </button>

              {/* Delivery Speed */}
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Choose a delivery speed
              </h3>
              <div className="space-y-3">
                {deliverySpeeds.map((speed) => (
                  <div
                    key={speed.id}
                    className={`border rounded-lg p-3 flex justify-between items-center ${
                      selectedSpeed === speed.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <label className="flex items-start gap-2 w-full cursor-pointer">
                      <input
                        type="radio"
                        name="deliverySpeed"
                        checked={selectedSpeed === speed.id}
                        onChange={() => setSelectedSpeed(speed.id)}
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{speed.label}</p>
                        <p className="text-xs text-gray-500">{speed.desc}</p>
                      </div>
                      <span className="text-sm font-semibold">
                        {speed.price === 0 ? "₹0.00" : `₹${speed.price}.00`}
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <p className="py-3 flex gap-2 items-center">
                {" "}
                <TbTruckDelivery size={20} /> Order may arrive in multiple
                shipments for quickest delivery possible.
              </p>
              <a href="/">View details about shipping options</a>
              <button className="mt-4 w-full bg-blue-800 text-white rounded-md py-2 font-medium">
                Save Delivery Speed →
              </button>
            </>
          ) : (
            <>
              {/* Edit address view */}
              <p className="text-sm font-medium text-gray-800 mb-3">
                Choose a Delivery Address
              </p>
              <button
                className="text-blue-600 text-sm font-medium mb-3"
                onClick={handleEditAddress}
              >
                + Add a new address
              </button>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-lg p-3 flex flex-col ${
                      selectedAddress === addr.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{addr.label}</p>
                        <p>{addr.name}</p>
                        <p>{addr.address}</p>
                        <p>{addr.phone}</p>
                        <div className="flex gap-4 mt-1 text-blue-600 text-xs font-medium">
                          <button>Edit</button>
                          <button>Remove</button>
                        </div>
                      </div>
                      {addr.default && (
                        <span className="text-xs text-gray-700 border px-2 py-1 rounded">
                          Default Shipping
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveAddress}
                className="mt-4 w-full bg-blue-800 text-white rounded-md py-2 font-medium"
              >
                Save Delivery Address →
              </button>
            </>
          )}
        </div>

        {/* Payment */}
        <div className="rounded-lg bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-3">Payment</h2>
          <div className="text-sm text-gray-700 mb-3">
            <p className="font-medium">{savedAddress.label}</p>
            <p>{savedAddress.name}</p>
            <p>{savedAddress.address}</p>
            <p>{savedAddress.phone}</p>
          </div>
          <button className="text-blue-600 text-sm font-medium">Change</button>
        </div>
      </div>

      {/* Right Side */}
      <div className="space-y-6 md:col-span-2">
        {/* GST */}
        <div className="rounded-lg bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold mb-2">
            GST Identification Number
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your GSTIN"
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <button className="bg-blue-800 text-white px-4 rounded-md text-sm">
              Apply
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            For business use only. GST must match billing address.
          </p>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹3,072.64</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>
              Shipping:{" "}
              {deliverySpeeds.find((s) => s.id === selectedSpeed)?.label}
            </span>
            <span className="text-green-600">
              {deliverySpeeds.find((s) => s.id === selectedSpeed)?.price === 0
                ? "FREE"
                : `₹${
                    deliverySpeeds.find((s) => s.id === selectedSpeed)?.price
                  }.00`}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>IGST</span>
            <span>₹367.36</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-semibold text-base mb-4">
            <span>Total due</span>
            <span>₹3,440.00</span>
          </div>

          {/* Items List */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold">Items</h3>
              <a
                href="/cart"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Edit Cart
              </a>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <ProjectImageCarousel
                      images={item.images}
                      smallWidth="w-16"
                      smallHeight="h-12"
                      showArrows={false}
                    />
                    <div className="text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Quantity: {item.qty}</p>
                      <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                        👁 View
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">₹{item.price}.00</p>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-5 w-full bg-blue-800 text-white rounded-md py-2 font-medium">
            Proceed to Payment
          </button>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <AddressModal address={editingAddress} onClose={handleCloseModals} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
