import React, { useState } from "react";

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("history");

  // Dummy orders data
  const orders = [
    {
      id: "ORD12345",
      date: "01 Sep 2025",
      totalAmount: 3440,
      numberOfItems: 4,
    },
    {
      id: "ORD12346",
      date: "15 Aug 2025",
      totalAmount: 1500,
      numberOfItems: 2,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-semibold text-lg mb-4">Order History & Reorder</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Order History
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "reorder"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("reorder")}
        >
          Reorder
        </button>
      </div>

      {/* Order History Tab */}
      {activeTab === "history" && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-4">
                When you've placed your first order, you'll see it here.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Order ID: {order.id}
                    </p>
                    <p className="text-xs text-gray-500">Date: {order.date}</p>
                    <p className="text-xs text-gray-500">
                      Items: {order.numberOfItems}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{order.totalAmount}.00
                    </p>
                    <a href="/order-details" className="mt-2 text-blue-600 text-xs font-medium hover:underline" >
                      View Order Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reorder Tab */}
      {activeTab === "reorder" && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reorders available
          </h3>
          <p className="text-gray-500 mb-4">
            Once you reorder items, they will show up here.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
