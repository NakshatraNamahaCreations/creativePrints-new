// src/components/LeftToolbar.jsx
import React from "react";

export default function LeftToolbar({ leftTools, activeTool, setActiveTool }) {
  return (
    <nav className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm border py-2">
      {leftTools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            className={
              "flex flex-col items-center justify-center px-2 py-3 text-[11px] border-l-4 transition-colors " +
              (isActive
                ? "border-blue-600 bg-blue-50 font-semibold text-blue-700"
                : "border-transparent hover:bg-gray-50 text-gray-600")
            }
            onClick={() => setActiveTool(tool.id)}
          >
            <span className={"h-8 w-8 rounded-lg flex items-center justify-center " + (isActive ? "bg-sky-200" : "")}>
              <img src={tool.icon} alt={tool.label} className="h-8 w-8 object-contain" />
            </span>
            <span className="leading-tight text-center" style={{ fontSize: "12px" }}>{tool.label}</span>
          </button>
        );
      })}

      {/* <div className="mt-auto px-3 py-3 space-y-2">
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={!selectedImage}
          className={
            "w-full flex items-center gap-2 justify-center py-2 rounded text-sm font-medium " +
            (selectedImage ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-100 text-gray-400 cursor-not-allowed")
          }
          title={selectedImage ? "Delete selected image" : "Select an image to delete"}
        >
          Delete selected
        </button>

        <button
          type="button"
          onClick={onClearUploads}
          disabled={!recentUploads?.length}
          className={
            "w-full flex items-center gap-2 justify-center py-2 rounded text-sm font-medium " +
            (recentUploads?.length ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-100 text-gray-400 cursor-not-allowed")
          }
        >
          Clear uploads
        </button>
      </div> */}
    </nav>
  );
}
