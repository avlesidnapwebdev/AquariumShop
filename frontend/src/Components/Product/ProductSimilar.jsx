import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { getProducts } from "../../api/api.js"; // Fetch all products from backend

export default function ProductSimilar({ categories = [] }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState(categories[0]?.title || "");
  const [productsByCategory, setProductsByCategory] = useState({});
  const scrollRefs = useRef({});

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const allProducts = res.data || [];

        // Organize products by category
        const grouped = {};
        categories.forEach((cat) => {
          grouped[cat.title] = allProducts.filter(
            (p) => p.category?.toLowerCase() === cat.title.toLowerCase()
          );
        });

        setProductsByCategory(grouped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [categories]);

  const scroll = (title, offset) => {
    if (!scrollRefs.current[title]) return;
    scrollRefs.current[title].scrollLeft += offset;
  };

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  return (
    <section className="w-full py-10 bg-gradient-to-tr from-sky-400 to-blue-600">
      {/* Popup */}
      {popupMessage && (
        <div className="fixed top-20 right-5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 md:px-10">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Similar Products</h2>
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
        .map((cat, i) => {
          const products = productsByCategory[cat.title] || [];
          if (!products.length) return null;

          return (
            <div key={i} className="mb-12">
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
                  {products.slice(0, 10).map((item, index) => (
                    <div
                      key={item._id || index}
                      className="relative group flex-none w-56 sm:w-64 md:w-72 h-auto rounded-xl bg-white shadow-md flex flex-col transition-transform transform-gpu hover:scale-105 hover:z-20"
                    >
                      {/* Product Link */}
                      <Link to={`/product/${item._id}`}>
                        <div className="h-40 flex justify-center items-center p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full object-contain rounded-xl"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="bg-blue-600 text-white font-bold text-sm md:text-base rounded-r-md px-3 py-1 w-fit">
                            ₹ {item.price}
                          </p>
                          <h4 className="text-blue-600 font-bold text-lg mt-2 capitalize line-clamp-2 py-3 px-2">
                            {item.name}
                          </h4>
                        </div>
                      </Link>

                      {/* Action Buttons */}
                      <div className="flex justify-around items-center w-full border-t p-2">
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
          );
        })}
    </section>
  );
}
