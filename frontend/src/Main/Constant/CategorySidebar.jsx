import React from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import data from "../../Data/CatrgoryData";
 
export default function CategorySidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    toggleSidebar(); // close after click
    navigate(`/shop?category=${encodeURIComponent(name)}`);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close button */}
      <button
        className="absolute top-5 right-5 text-2xl text-blue-700"
        onClick={toggleSidebar}
      >
        <FaTimes />
      </button>

      {/* Sidebar content */}
      <div className="flex flex-col items-start gap-6 mt-16 px-6">
        <h3 className="text-lg font-bold text-blue-600 underline uppercase">
          Categories
        </h3>

        <div className="flex flex-col gap-5 w-full overflow-y-auto max-h-[75vh] pr-2">
          {data.map(({ id, name, image }) => (
            <div
              key={id}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
              onClick={() => handleCategoryClick(name)}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full shadow-md flex items-center justify-center bg-white">
                <img
                  src={image}
                  alt={name}
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Name */}
              <span className="text-sm font-medium text-gray-800">{name}</span>
            </div>
          ))}

          
        </div>
      </div>
    </div>
  );
}
