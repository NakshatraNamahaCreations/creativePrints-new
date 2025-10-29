import React, { useState } from "react";
import { IoChevronUp, IoChevronDown, IoTrashOutline } from "react-icons/io5";
import ProjectImageCarousel from "../components/ProjectImageCarousel";
import { MdErrorOutline } from "react-icons/md";
import GeneralButton from "../ui/GeneralButton";
import OutlineButton from "../ui/OutlineButton";

const images = [
  "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  "https://i.pinimg.com/736x/26/84/e7/2684e78ec374a7adde58e191e3980fbb.jpg",
  "https://i.pinimg.com/736x/fe/f0/ca/fef0ca668799471d75e23436b6a1c9e6.jpg",
];

const CartItem = ({
  isEditable = false,
  showStatus = false,
  onCartClick,
  onEditReorderClick,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition mb-6 p-4">
      <div className="flex flex-col md:flex-row gap-6 ">
        {/* Left: Product images */}
        <div className="w-full md:w-[200px] flex flex-col items-center">
          <ProjectImageCarousel images={images} />
          {isEditable && (
            <div className="mt-3 flex gap-4 text-xs font-medium text-blue-600">
              <button className="hover:underline">Edit Design</button>
              <button className="hover:underline">Edit Options</button>
            </div>
          )}
        </div>

        {/* Right: Product details */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Title + Remove */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Standard Visiting Cards
              </p>
              {/* <p className="text-xs text-gray-500">Product ID: VC-12345</p> */}
            </div>
            {isEditable && (
              <button className="text-red-600 flex items-center gap-1 text-xs font-medium hover:text-red-700 cursor-pointer">
                <IoTrashOutline className="text-sm" />
                Remove
              </button>
            )}
          </div>

          {/* Qty + Price */}
          <div className="mt-4 ">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-700">QTY:</p>
              {isEditable ? (
                <select className="border rounded-md px-3 py-1 text-xs focus:ring-2 focus:ring-blue-500">
                  <option>500</option>
                  <option>300</option>
                  <option>200</option>
                  <option>100</option>
                </select>
              ) : (
                <p className="text-gray-700">200</p>
              )}
            </div>
            {showStatus && (
              <p className="text-red-600 flex gap-2 items-center">
                Cancelled <MdErrorOutline />
              </p>
            )}
          </div>

          {/* Selected Options */}
          <div className="mt-5  pt-3">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-800"
            >
              <span>Selected Options</span>
              {showOptions ? (
                <IoChevronUp className="text-sm" />
              ) : (
                <IoChevronDown className="text-sm" />
              )}
            </button>

            {showOptions && (
              <div className="mt-3 text-xs text-gray-700">
                <div className="">
                  {/* Options list */}
                  <div className="flex justify-between ">
                    <span>Base Price:</span>
                    <span className="font-medium">₹1,375.00</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Inside front Cover: Color</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Back Cover: Color</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Inside Back Cover: Color</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Delivery Speed: Standard</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Size: A5</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Style: Notebook</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Filler Paper: Diary</span>
                    <span className="font-medium">₹125.00</span>
                  </div>
                </div>
              </div>
            )}
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Item Total</span>
              <span>₹1,500.00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-5 col-span-2 justify-end mt-3">
        {onCartClick && (
          <GeneralButton buttonText="Add to cart" onClick={onCartClick} />
        )}
        {onEditReorderClick && (
          <OutlineButton buttonText="Edit Design & reorder" onClick={onEditReorderClick}/>
        )}
      </div>
    </div>
  );
};

export default CartItem;
