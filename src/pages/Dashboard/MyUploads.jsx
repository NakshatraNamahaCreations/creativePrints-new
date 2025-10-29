import React, { useState } from 'react';

const MyUploads = () => {
  const [selectedImage, setSelectedImage] = useState(null); // State for the modal
  const uploads = [
    { name: 'company-logo.png', date: 'Aug 25, 2023', size: '2.4 MB', imageUrl: 'https://img.freepik.com/free-vector/quill-pen-logo-template_23-2149852429.jpg' },
    { name: 'product-photo.jpg', date: 'Aug 22, 2023', size: '1.8 MB', imageUrl: 'https://img.freepik.com/free-vector/flat-design-ac-logo-design_23-2149482027.jpg' },
    { name: 'background-pattern.svg', date: 'Aug 20, 2023', size: '0.5 MB', imageUrl: 'https://png.pngtree.com/png-vector/20220309/ourmid/pngtree-green-sprout-leaf-logo-design-template-png-image_4486740.png' },
    { name: 'brochure-content.docx', date: 'Aug 18, 2023', size: '0.2 MB', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyRR9k4Ypd4Zgk7yWtO0OD7YKFFmiiJ45kag&s' }
  ];

  const handleCardClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the clicked image to the modal
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // Close the modal
  };

  return (
    <div className=" mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">My Uploads</h2>
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">You have {uploads.length} uploaded files</p>
         
        </div>

        {/* Card Layout */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-300"
              onClick={() => handleCardClick(upload.imageUrl)} // Click to open modal
            >
              <div className="text-center">
                <img
                  src={upload.imageUrl}
                  alt={upload.name}
                  className="w-32 h-32 object-contain mb-4 mx-auto"
                />
                <h3 className="text-sm font-medium text-gray-900">{upload.name}</h3>
                <p className="text-xs text-gray-500">{upload.date}</p>
                <p className="text-xs text-gray-500">{upload.size}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Image Preview */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 text-3xl text-white hover:text-gray-800"
              >
                &times; {/* Close button */}
              </button>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUploads;
