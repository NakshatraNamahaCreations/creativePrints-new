// import React from "react";

// const CategoryBanner = () => {
//   return (
//     <div className="w-full bg-gray-100 py-8">
//   <div className="container mx-auto px-4 flex justify-end">
//     <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl">
//           {/* Text Content - Now on the right side */}
//           <div className="md:w-1/2 mb-6 md:mb-0  md:pl-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Labels, Stickers & Packaging
//             </h1>
//             <p className="text-lg text-gray-700 mb-6">
//               Promote your business logo with customized stickers, labels,
//               and packaging.
//             </p>
//             <div className="flex flex-wrap gap-3">
//               <button className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors">
//                 Labels
//               </button>
//               <button className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors">
//                 Stickers
//               </button>
//               <button className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors">
//                 Packaging
//               </button>
//             </div>
//           </div>

//           {/* Image Placeholder - Now on the left side */}
//           <div className="md:w-[50%] flex justify-center ">
//             <div className="w-full h-64 rounded-lg flex items-center justify-center overflow-hidden">
//               <img
//                 src="https://images.unsplash.com/photo-1597481308307-1a5b262a544f?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//                 alt="Labels, Stickers & Packaging"
//                 className="w-full h-full object-cover rounded-lg"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryBanner;

import React from "react";

const CategoryBanner = ({
  bgColor = "bg-gray-100",
  title = "Category Title",
  description = "Category description goes here.",
  image,
  buttons = [],
}) => {
  return (
    <div className={`w-full ${bgColor} py-8`}>
      <div className="container mx-auto px-4 flex justify-end">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl">
          {/* Text Content */}
          <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-700 mb-6">{description}</p>

            <div className="flex flex-wrap gap-3">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.onClick}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="md:w-[50%] flex justify-center">
            <div className="w-full h-64 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
