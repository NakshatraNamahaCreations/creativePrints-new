import React from "react";

const RoundCard = ({ item, onClick }) => {
  return (
       <div className="max-w-xs p-3 my-2 bg-blue-100/20 cursor-pointer relative rounded-lg shadow-sm hover:shadow-md transition-shadow" onClick={onClick}>

          {/* Product Image */}
          <div className="relative w-42 h-42 mx-auto p-2 mb-4 overflow-hidden rounded-lg">
            <img
              src={item?.image}
              alt={item?.title}
              className="w-full h-full rounded-full object-cover transition-transform hover:scale-105"
            />
          </div>
    
          {/* Product Info */}
          <div className="text-center">
            <h3 className="text-md font-normal text-gray-900 mb-1">
              {item?.title}
            </h3>
    
            {/* Product Code */}
           {item?.subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
          </div>
        </div>
   
  );
};

export default RoundCard;


//  <div
//       className="mt-6 max-w-sm rounded-xl  p-6 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300  border border-border border-gray-200 hover:border-gray-300"
//       onClick={onClick}
//     >
//       <div className="relative w-32 h-32 mx-auto mb-4">
//         <img
//           src={item?.image}
//           alt={item?.title}
//           className="w-full h-full object-cover rounded-full border-4 border-gray-200"
//         />
//       </div>

//       <div className="text-center">
//         <p className="text-sm font-semibold text-text">{item?.title}</p>
//         {item?.subTitle && (
//           <p className="text-xs text-text-light mt-2">{item?.subTitle}</p>
//         )}

//       </div>
//     </div>