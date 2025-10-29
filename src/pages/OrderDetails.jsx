import React, { useState } from "react";
import OutlineButton from "../ui/OutlineButton";
import CartItem from "./CartItem";
import GeneralButton from "../ui/GeneralButton";

const OrderDetails = () => {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className=" px-6 ">
          <h1 className="text-2xl font-bold ">Order Details</h1>
        </div>

        <div className="px-6">
          {/* User email */}
          <div className="mb-6">
            <p className="text-gray-600 font-medium">ops.nnc@gmail.com</p>
          </div>

          {/* Order info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1">
              <p className="text-sm text-gray-500">Order #</p>
              <p className="font-medium">VP_4KPSFQRD</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">01-09-2025</p>
            </div>

            <div className="flex gap-5 col-span-2 justify-end">
              <OutlineButton buttonText="Print Order Details" />
              <OutlineButton buttonText="Download Tax Invoices" />
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>
          <div className="grid grid-cols-8">
            {/* Delivery Speed */}
            <div className="mb-6 col-span-2">
              <h2 className="text-lg font-semibold mb-2">Delivery Speed</h2>
              <p className="text-gray-700">Standard</p>
              <p className="text-gray-600">Estimated Arrival 8 September</p>
            </div>

            {/* Delivery Address */}
            <div className="mb-6 col-span-2">
              <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
              <div className="text-gray-700">
                <p>nnc company</p>
                <p>Nakshatra Namaha Creations</p>
                <p>#374, Dwaraka Nagar, Channasandra</p>
                <p>Near Yuva Hardware</p>
                <p>Bengaluru, Karnataka 560098</p>
                <p>India</p>
                <p className="mt-2">6364828146</p>
              </div>
              <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Change
              </button>
            </div>

            {/* Billing Address */}
            <div className="mb-6 col-span-2">
              <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
              <div className="text-gray-700">
                <p>XYZ QQQ</p>
                <p>XYZ</p>
                <p>Channasandra Near Yuva Hardware</p>
                <p>Bengaluru, Karnataka 560098</p>
                <p>India</p>
                <p className="mt-2">8762345723</p>
              </div>
            </div>
            {/* Payment Method */}
            <div className="mb-6 col-span-2">
              <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-700">CashOnDelivery</p>
                <p className="text-lg font-bold">₹3,440.00</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>
        </div>
        <div className="flex justify-between gap-20 p-6 max-w-7xl mx-auto">
          {/* Left: Cart Items */}
          <div className="w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Items</h3>
            <div className="">
              {items.map((item) => (
                <CartItem
                  key={item}
                  showStatus={true}
                  onCartClick={() => alert("clicked on Add to cart")}
                  onEditReorderClick={() =>
                    alert("clicked on Edit Design & reorder")
                  }
                />
              ))}

            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-1/3 rounded-lg p-2 bg-white shadow-sm h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            {/* Subtotal */}
            <div className="flex justify-between text-sm mb-2">
              <p className="text-gray-700">Subtotal</p>
              <p className="font-medium">₹3,440.00</p>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm mb-2">
              <p className="text-gray-700">Shipping</p>
              <p className="font-medium">₹0.00</p>
            </div>
            {/* GST */}
            <div className="flex justify-between text-sm mb-2">
              <p className="text-gray-700">IGST</p>
              <p className="font-medium">₹370.00</p>
            </div>

            {/* Discount / Coupon */}
            <div className="mt-4">
              <button className="flex items-center text-sm font-medium text-blue-600">
                Have a code?
              </button>

              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 border rounded-l px-3 py-2 text-sm outline-none"
                />

                <button className="bg-blue-800 border-2 border-blue-800 text-white px-4 rounded-r text-sm">
                  Apply
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Total */}
            <div className="flex justify-between text-base font-semibold mb-6">
              <p>Total</p>
              <p>₹3,810.00</p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-800 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
