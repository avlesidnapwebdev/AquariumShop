import React, { useState } from "react";
import data from "../../Data/ProductsData.jsx";
import { useCart } from "../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
 
export default function Products() {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [activeCategory, setActiveCategory] = useState("All Items");
  const [popupMessage, setPopupMessage] = useState("");

  const categories = ["All Items", "Sales", "Featured", "Best Seller"];

  // Filter by category
  const categoryFiltered =
    activeCategory === "All Items"
      ? data
      : data.filter((item) => item.category === activeCategory);

  function formatCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return count;
  }

  // Show popup for 2 seconds
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-cyan-400 to-blue-600 py-12 px-4 md:px-10 relative">
      {/* Popup message */}
      {popupMessage && (
  <div className="fixed top-24 right-5 transform -translate-x-3.5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
    {popupMessage}
  </div>
)}


      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-white underline uppercase mb-4 md:mb-0">
          Trending This Week:
        </h3>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-bold text-sm md:text-base transition 
                ${
                  activeCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-transparent text-white hover:bg-cyan-100 hover:text-blue-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-items-center">
        {categoryFiltered.length === 0 ? (
          <p className="text-center text-lg text-blue-500">No items found.</p>
        ) : (
          categoryFiltered.map(
            ({ id, title, image, price, rating, reviewCount }) => (
              <div
                key={id}
                className="relative group w-3/4 h-full rounded-xl bg-white shadow-md flex flex-col transition transform hover:scale-105"
              >
                {/* Image */}
                <div className="h-48 flex justify-center items-center p-4">
                  <img
                    src={image}
                    alt={title}
                    className="max-h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  {/* Price + Title */}
                  <p className="bg-blue-600 text-white font-bold text-base rounded-r-md px-3 py-2 w-fit">
                    ₹ {price}
                  </p>
                  <h4 className="text-blue-600 font-bold text-lg mt-2 line-clamp-2 px-2">
                    {title}
                  </h4>
                </div>

                {/* Action Buttons (Cart + Wishlist) */}
                <div className="flex justify-around items-center w-full border-t p-2">
                  {/* Add to Cart */}
                  <button
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:text-red-600 transition"
                    onClick={() => {
                      addToCart({ id, title, image, price });
                      showPopup("✅ Added to Cart");
                    }}
                  >
                    <FiShoppingCart size={22} />
                    <span className="hidden sm:inline">Cart</span>
                  </button>

                  {/* Add to Wishlist */}
                  <button
                    className="flex items-center gap-2 text-blue-500 hover:text-red-600 font-semibold transition"
                    onClick={() => {
                      addToWishlist({ id, title, image, price });
                      showPopup("❤️ Added to Wishlist");
                    }}
                  >
                    <FaHeart size={22} />
                    <span className="hidden sm:inline">Wishlist</span>
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </section>
  );
}
