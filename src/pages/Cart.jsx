import React from "react";
import CartItem from "./CartItem";
import { IoChevronUp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-20 p-6 max-w-7xl mx-auto">
      {/* Left: Cart Items */}
      <div className="md:col-span-3">
        <h3 className="text-2xl font-semibold mb-4">My Cart</h3>
        <div className="space-y-6">
          <CartItem isEditable={true} />
          <CartItem isEditable={true} />
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="md:col-span-2 rounded-lg p-2 bg-white shadow-sm h-fit">
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
        
              <button  className="bg-blue-800 border-2 border-blue-800 text-white px-4 rounded-r text-sm">
                Apply
              </button>
     
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4" />

        {/* Total */}
        <div className="flex justify-between text-base font-semibold mb-6">
          <p>Total</p>
          <p>₹3,440.00</p>
        </div>

        {/* Checkout Button */}
        <button  onClick={()=> navigate("/checkout")} className="w-full bg-blue-800 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
