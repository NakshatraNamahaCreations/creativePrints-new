// src/components/UploadsPanel.jsx
import React from "react";

export default function UploadsPanel({ recentUploads, onUploadFromDevice, onAddFromThumbnail, onDeleteUpload }) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold text-lg mb-3">Uploads</h3>

      <label className="mb-3">
        <span className="inline-flex items-center justify-center w-full rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 cursor-pointer">
          Upload from this device
        </span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={onUploadFromDevice} />
      </label>

      <p className="text-xs text-gray-600 mb-2">Recently uploaded</p>

      {recentUploads.length === 0 ? (
        <p className="text-xs text-gray-400">No uploads yet. Use the button above to add images.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {recentUploads.map((url, idx) => (
            <div key={idx} className="relative">
              <button type="button" className="relative w-full pt-[100%] rounded-md overflow-hidden border hover:ring-2 hover:ring-sky-500" onClick={() => onAddFromThumbnail(url)}>
                <img src={url} alt={`Upload ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteUpload(idx);
                }}
           className="absolute top-1 right-1 rounded-full bg-white/90 hover:bg-red-100 border text-red-600 shadow-sm w-5 h-5 flex items-center justify-center p-0.5"
  title="Remove upload"
              >
                 ✕
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">...</svg>
</button>  
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
