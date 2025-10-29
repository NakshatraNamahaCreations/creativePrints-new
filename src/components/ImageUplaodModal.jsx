import React, { useState } from "react";
import GeneralButton from "../ui/GeneralButton";

const ImageUploadModal = ({ isOpen, onClose, onLogoSelect }) => {
  const [recentLogos, setRecentLogos] = useState([
    {
      id: 1,
      name: "Ganpati",
      preview:
        "https://i.pinimg.com/736x/e5/ff/59/e5ff5911b80e8c71914a448e3a3ea5fa.jpg",
    },
    {
      id: 2,
      name: "Ganpati 2",
      preview:
        "https://i.pinimg.com/736x/88/94/47/889447fff659c1898a4abbafbf80c57e.jpg",
    },
    {
      id: 3,
      name: "Dark Style",
      preview:
        "https://i.pinimg.com/736x/c2/3f/79/c23f7903e1a75e020137c9a3b9f821db.jpg",
    },
    {
      id: 4,
      name: "Smoking Girl",
      preview:
        "https://i.pinimg.com/736x/db/23/c2/db23c2c11d0fceb2dd27614ee28154f5.jpg",
    },
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      onLogoSelect(file);
      setRecentLogos([
        ...recentLogos,
        {
          id: recentLogos.length + 1,
          name: file.name,
          preview: previewUrl,
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-sans">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-0">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add logo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-700 mb-3">
            Upload a high resolution logo for the best printing quality. The
            best file format for logos has a{" "}
            <span className="font-medium">.png</span> extension.
          </p>

          <div className="mb-3">
            <p className="text-sm font-medium text-gray-800 mb-1">
              Accepted formats
            </p>
            <p className="text-xs text-gray-500">
              .jpg, .jpeg, .jfif, .bmp, .png, .gif, .heic, .svg, .webp, .pdf,
              .psd, .ai, .eps, .ait, .ppt, .pptx, .tif, .tiff
            </p>
          </div>

          {/* Upload Button */}
          <div className="mb-6">
            <label className="block cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.jfif,.bmp,.png,.gif,.heic,.svg,.webp,.pdf,.psd,.ai,.eps,.ait,.ppt,.pptx,.tif,.tiff"
                onChange={handleFileUpload}
              />
              <div className="bg-blue-100 text-blue-700 text-center py-2 font-medium rounded-md hover:bg-blue-200 transition">
                Upload logo or image
              </div>
            </label>
          </div>

          {/* Recently Uploaded */}
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Recently Uploaded
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {recentLogos.map((logo) => (
                <div
                  key={logo.id}
                  onClick={() => {
                    onLogoSelect(logo);
                    onClose();
                  }}
                  className="cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-md overflow-hidden"
                >
                  <img
                    src={logo.preview}
                    alt={logo.name}
                    className="w-full h-22 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-md">
          <GeneralButton
            onClick={onClose}
            buttonText="Cancel"
            bgcolor="blue-800"
            textColor="white"
            roundedClass="rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
