import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Stars from "../ui/Stars";

const ProductCard = ({ item, onClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="max-w-xs p-4 my-2 cursor-pointer bg-white relative rounded-lg shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <button
        onClick={handleWishlistClick}
        className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <FaHeart className="w-5 h-5 text-red-500" />
        ) : (
          <FaRegHeart className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Badge */}
      {item?.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800`}
          >
            {item.badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-48 mb-2 overflow-hidden rounded-lg">
        <img
          src={item?.image}
          alt={item?.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="text-left">
        <h3 className="text-md font-normal text-gray-900 mb-1">
          {item?.title}
        </h3>

        {/* Product subtitle */}
        {item?.subtitle && (
          <p className="text-xs text-gray-500 mb-2">{item?.subtitle}</p>
        )}
        {item?.rating && (
          <div className="flex items-center gap-3 pb-2">
            <Stars value={item.rating} size="w-4 h-4" />
            <span className="text-gray-900 font-medium text-xs">{item.rating}</span>
          </div>
        )}
        {/* Product price */}
        {item?.price && <p className="text-sm text-gray-700 ">{item?.price}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
