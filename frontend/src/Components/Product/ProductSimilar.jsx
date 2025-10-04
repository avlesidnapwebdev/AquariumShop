// src/Components/Product/ProductSimilar.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
 
export default function ProductSimilar({ categories }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState(categories[0]?.title || ""); // default first category
  const scrollRefs = useRef({});

  const scroll = (title, offset) => {
    if (!scrollRefs.current[title]) return;
    scrollRefs.current[title].scrollLeft += offset;
  };

  // ✅ Popup for 2 seconds
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  return (
    <section className="w-full py-10 bg-gradient-to-tr from-sky-400 to-blue-600 ">
      {/* Popup */}
      {popupMessage && (
        <div className="fixed top-20 right-5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 md:px-10">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Similar Products</h2>

        {/* Tabs */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(cat.title)}
              className={`pb-1 font-medium ${
                activeTab === cat.title
                  ? "text-white border-b-2 border-black"
                  : "text-white hover:text-black"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Carousel */}
      {categories
        .filter((cat) => cat.title === activeTab)
        .map((cat, i) =>
          cat.data && cat.data.length > 0 ? (
            <div key={i} className="mb-12">
              {/* Carousel wrapper */}
              <div className="relative w-full">
                {/* Scroll Left */}
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-50 hover:bg-blue-600 transition"
                  onClick={() => scroll(cat.title, -300)}
                  aria-label="scroll left"
                >
                  ❮
                </button>

                {/* Cards */}
                <div
                  ref={(el) => (scrollRefs.current[cat.title] = el)}
                  className="flex gap-4 md:gap-6 px-4 md:px-10 scroll-smooth cursor-grab active:cursor-grabbing no-scrollbar items-center overflow-x-auto py-6"
                >
                  {cat.data.slice(0, 10).map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="relative group flex-none w-56 sm:w-64 md:w-72 h-auto rounded-xl bg-white shadow-md flex flex-col transition-transform transform-gpu hover:scale-105 hover:z-20"
                    >
                      {/* ✅ Link to product page */}
                      <Link to={`/product/${item.id}`}>
                        <div className="h-40 flex justify-center items-center p-4">
                          <img
                            src={item.image}
                            alt={item.title || item.name}
                            className="max-h-full object-contain rounded-xl"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="bg-blue-600 text-white font-bold text-sm md:text-base rounded-r-md px-3 py-1 w-fit">
                            ₹ {item.price}
                          </p>
                          <h4 className="text-blue-600 font-bold text-lg mt-2 capitalize line-clamp-2 py-3 px-2">
                            {item.title || item.name}
                          </h4>
                        </div>
                      </Link>

                      {/* Action Buttons */}
                      <div className="flex justify-around items-center w-full border-t p-2">
                        {/* Add to Cart */}
                        <button
                          className="flex items-center gap-2 text-blue-600 font-semibold hover:text-red-600 transition"
                          onClick={() => {
                            addToCart(item);
                            showPopup("✅ Added to Cart");
                          }}
                        >
                          <FiShoppingCart size={20} />
                          <span className="hidden sm:inline">Cart</span>
                        </button>

                        {/* Add to Wishlist */}
                        <button
                          className="flex items-center gap-2 text-blue-500 hover:text-red-600 font-semibold transition"
                          onClick={() => {
                            addToWishlist(item);
                            showPopup("❤️ Added to Wishlist");
                          }}
                        >
                          <FaHeart size={20} />
                          <span className="hidden sm:inline">Wishlist</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scroll Right */}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-20 hover:bg-blue-600 transition"
                  onClick={() => scroll(cat.title, 300)}
                  aria-label="scroll right"
                >
                  ❯
                </button>
              </div>
            </div>
          ) : null
        )}
    </section>
  );
}
