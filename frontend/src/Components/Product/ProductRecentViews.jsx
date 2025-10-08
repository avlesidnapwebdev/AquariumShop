import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";

export default function ProductRecentViews({ recent }) {
  const scrollRef = useRef();
  const { addToWishlist } = useWishlist();
 
  if (!recent || recent.length === 0) {
    return null; // Hide if no recent views
  }

  // ✅ Scroll function
  const scroll = (scrollOffset) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += scrollOffset;
  };

  return (
    <section className="w-full my-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-10">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          Recently Viewed
        </h3>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative w-full mt-6 overflow-visible">
        {/* Scroll Left */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-40 hover:bg-purple-600 transition"
          onClick={() => scroll(-300)}
          aria-label="scroll left"
        >
          ❮
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 px-4 md:px-10 scroll-smooth cursor-grab active:cursor-grabbing no-scrollbar items-center overflow-x-auto overflow-y-visible py-6"
        >
          {recent.map((item) => (
            <div
              key={item.id}
              className="relative group flex-none w-40 sm:w-48 md:w-56 h-auto rounded-xl bg-white shadow-md flex flex-col transition-transform transform-gpu hover:scale-105 hover:z-20"
            >
              {/* Image + Name */}
              <Link to={`/product/${item.id}`}>
                <div className="h-32 flex justify-center items-center p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full object-contain rounded-xl"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-gray-700 font-semibold text-base mt-2 capitalize line-clamp-2 px-2 pb-3">
                    {item.name}
                  </h4>
                </div>
              </Link>

              {/* Wishlist Button */}
              <div className="flex justify-center items-center border-t p-2">
                <button
                  className="flex items-center gap-2 text-purple-600 hover:text-red-600 font-semibold transition"
                  onClick={() => addToWishlist(item)}
                >
                  <FaHeart size={18} />
                  <span className="hidden sm:inline">Wishlist</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Right */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-40 hover:bg-purple-600 transition"
          onClick={() => scroll(300)}
          aria-label="scroll right"
        >
          ❯
        </button>
      </div>
    </section>
  );
}
