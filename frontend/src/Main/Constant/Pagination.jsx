import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
 
  return (
    <div className="flex justify-center mt-8 space-x-2">
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 border rounded ${
            currentPage === num ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded flex items-center justify-center disabled:opacity-50"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}
