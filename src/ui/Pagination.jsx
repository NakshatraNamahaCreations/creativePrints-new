import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pagesToShow = 3; // how many middle pages to show

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 6) {
      // show all pages if not too many
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-2" style={{marginLeft:'20%'}}>
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-500 hover:text-black disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={i} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === page
                ? "bg-gray-200 font-semibold border-gray-400"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-500 hover:text-black disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
