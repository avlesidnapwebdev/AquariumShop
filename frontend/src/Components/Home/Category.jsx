import React from "react";
import { useNavigate } from "react-router-dom";
import data from "../../Data/CatrgoryData";
 
export default function Category() {
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    navigate(`/shop?category=${encodeURIComponent(name)}`);
  };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="px-5 sm:px-10 lg:px-20 w-full">
        {/* Title */}
        <h3 className="text-base text-blue-600 sm:text-lg md:text-xl lg:text-2xl font-bold underline uppercase text-left">
          Browse By Categories:
        </h3>

        {/* Category list */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-14 mt-8 w-full max-w-8xl mx-auto">
          {data.map(({ id, name, image }) => (
            <div
              key={id}
              className="flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={() => handleCategoryClick(name)}
            >
              {/* Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-md flex items-center justify-center bg-white hover:shadow-lg transition">
                <img
                  src={image}
                  alt={name}
                  className="w-10 sm:w-12 md:w-14 object-contain"
                />
              </div>

              {/* Category Name */}
              <span className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
