// Dashboard.js
import React from "react";
import { useState } from "react";
import RecommendedCarousal from "../../components/RecommendedCarousal";
import ImageUploadModal from "../../components/ImageUplaodModal";
import CanvaButton from "../../components/CanvaButton";

const data = [
  {
    id: 1,
    title: "Customized Sipper bottles",
    price: "1 starting at Rs.680",
    image:
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  },
  {
    id: 2,
    title: "Arcylic Keychains",
    price: "20 starting at Rs.2000",
    image:
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  },
  {
    id: 3,
    title: "Custom Bookmarkes",
    price: "5 starting at Rs.100",
    image:
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  },
  {
    id: 4,
    title: "Tent Cards",
    price: "5 starting at Rs.100",
    image:
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  },
  {
    id: 5,
    title: "Letterheads",
    price: "10 starting at Rs.230",
    image:
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  },
  {
    id: 6,
    title: "Arcylic Sign",
    price: "1 starting at Rs.650",
    image:
      "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
  },
];

// Sample data - in a real app this would come from API
const accountData = {
  printProjects: 9,
  brandKits: 0,
  orders: 0,
  latestProjects: [
    {
      name: "Fox Fox Sake Mug",
      edited: "28 Aug",
      image:
        "https://i.pinimg.com/1200x/26/84/e7/2684e78ec374a7adde58e191e3980fbb.jpg",
      // status: "COMPLETED"
    },
    {
      name: "Classic Visiting Cards",
      edited: "22 Aug",
      image:
        "https://i.pinimg.com/736x/10/1f/39/101f391a03945446866a6858f11b5abc.jpg",
      // status: "IN REVIEW"
    },

    {
      name: "NNC Company",
      edited: "18 Aug",
      image:
        "https://i.pinimg.com/736x/fe/f0/ca/fef0ca668799471d75e23436b6a1c9e6.jpg",
      // status: "IN PROGRESS"
    },
    {
      name: "Rounded Corner Visiting Cards",
      edited: "20 Aug",
      image:
        "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
      // status: "COMPLETED"
    },
  ],
};

const Dashboard = () => {
  // State for modal visibility
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  // State for selected logo
  const [selectedLogo, setSelectedLogo] = useState(null);

  // Function to handle logo selection
  const handleLogoSelect = (logo) => {
    setSelectedLogo(logo);
    // You can add additional logic here to handle the selected logo
    console.log("Logo selected:", logo);
  };

  // Function to open the modal
  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  // Function to close the modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Header */}
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900">Account</h1>
          <p className="text-gray-600">Hello, Sonali Keshri.</p>
          <p className="text-gray-600">
            Here's what's going on in your account.
          </p>
        </div>


        <button className="border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50">
          Account Settings
        </button>
      </div>

      {/* Account Snapshot */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Account snapshot</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm">Print Projects</h3>
            <p className="text-2xl font-bold">{accountData.printProjects}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm">Brand Kits</h3>
            <p className="text-2xl font-bold">{accountData.brandKits}</p>
            <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-800">
              Create Brand Kit
            </button>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm">Orders</h3>
            {accountData.orders === 0 ? (
              <>
                <p className="text-gray-600">You don't have any orders yet.</p>
                <p className="text-gray-600 text-sm mt-1">
                  When you've placed your first order, you'll see it here.
                </p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Continue Shopping
                </button>
              </>
            ) : (
              <p className="text-2xl font-bold">{accountData.orders}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Latest Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Latest projects</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              View all
            </button>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {accountData.latestProjects.map((project, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate">
                      {project.name}
                    </h3>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Edited: {project.edited}
                      </p>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized Recommendations Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-lg">
              Personalise your recommendations
            </h2>
            <p className="text-gray-600">
              Create a Brand Kit to keep track of your logo, colours, fonts and
              more. Get recommendations based on your brand and style across
              CreativePrint.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Brand Kit Information
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your business name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload or choose logo
                </label>
                <div
                  className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={openImageModal}
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Create Brand Kit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <img
                src="https://i.pinimg.com/736x/17/86/e7/1786e76512680c948c68f171e4a1aae5.jpg"
                className="w-full h-52 object-cover rounded-lg"
                alt="Brand example 1"
              />
              <img
                src="https://i.pinimg.com/1200x/8c/bf/92/8cbf92eb40a0c6bb887d73fd78fadafb.jpg"
                className="w-full h-52 object-cover rounded-lg"
                alt="Brand example 2"
              />
            </div>
          </div>
        </div>

        {/* Recommended Products Carousel */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Recommended for you</h2>
            <p className="text-gray-600">
              Products we think you'll love based on your preferences
            </p>
          </div>
          <div className="p-6">
            <RecommendedCarousal data={data} slideshow={4} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <span className="text-sm text-gray-700">New Project</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <span className="text-sm text-gray-700">Upload Design</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10m4 0h4m-4 0V7"
                ></path>
              </svg>
            </div>
            <span className="text-sm text-gray-700">Brand Kit</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <span className="text-sm text-gray-700">Invite Team</span>
          </button>
        </div>
      </div>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onLogoSelect={handleLogoSelect}
      />
    </div>
  );
};

export default Dashboard;
