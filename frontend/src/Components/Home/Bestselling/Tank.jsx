import React, { useRef, useEffect, useState } from "react";
import { useCart } from "../../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../../Main/Constant/Wishlist.jsx";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getProducts } from "../../../api/api.js"; // ✅ Backend API

export default function Tank() {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const scrollRef = useRef();
  const [popupMessage, setPopupMessage] = useState("");
  const [tankProducts, setTankProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     ✅ Fetch Tank Category Products from Backend
  ============================================================ */
  useEffect(() => {
    const fetchTankProducts = async () => {
      try {
        const { data } = await getProducts();
        if (data && Array.isArray(data)) {
          const tankItems = data.filter(
            (item) => item.category?.toLowerCase() === "tank"
          );
          setTankProducts(tankItems);
        }
      } catch (err) {
        console.error("❌ Error fetching Tank products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTankProducts();
  }, []);

  /* ============================================================
     ✅ Infinite Scroll Logic
  ============================================================ */
  const scroll = (scrollOffset) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += scrollOffset;
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth / 3;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      if (scrollLeft >= scrollWidth * 2) {
        scrollContainer.scrollLeft = scrollLeft - scrollWidth;
      } else if (scrollLeft <= 0) {
        scrollContainer.scrollLeft = scrollLeft + scrollWidth;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [tankProducts]);

  /* ============================================================
     ✅ Popup Function
  ============================================================ */
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  if (loading) {
    return (
      <section className="w-full min-h-[40vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-400">
        <h3 className="text-white text-lg font-semibold animate-pulse">
          Loading Tank products...
        </h3>
      </section>
    );
  }

  if (tankProducts.length === 0) {
    return (
      <section className="w-full min-h-[40vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-400">
        <h3 className="text-white text-lg font-semibold">
          No Tank products found.
        </h3>
      </section>
    );
  }

  /* ============================================================
     ✅ Render UI
  ============================================================ */
  const infiniteTankData = [...tankProducts, ...tankProducts, ...tankProducts];

  return (
    <section className="w-full min-h-auto bg-gradient-to-r from-blue-600 to-cyan-400 py-10 relative">
      {/* Popup */}
      {popupMessage && (
        <div className="fixed top-24 right-5 transform -translate-x-3.5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-20">
        <h3 className="text-white text-xl md:text-2xl font-semibold underline uppercase">
          Best Selling Tank & Decoration:
        </h3>
      </div>

      {/* Carousel wrapper */}
      <div className="relative w-full mt-6 overflow-visible">
        {/* Scroll Left */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-40 hover:bg-blue-600 transition"
          onClick={() => scroll(-300)}
          aria-label="scroll left"
        >
          ❮
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 px-4 md:px-10 scroll-smooth cursor-grab active:cursor-grabbing no-scrollbar items-center overflow-x-auto overflow-y-visible py-10"
        >
          {infiniteTankData.map((item, index) => (
            <div
              key={`${item._id || item.id}-${index}`}
              className="relative group flex-none w-56 sm:w-64 md:w-72 h-80 rounded-xl bg-white shadow-md flex flex-col transition-transform transform-gpu hover:scale-105 hover:z-20"
            >
              <Link to={`/product/${item._id}`}>
                {/* Image */}
                <div className="h-40 flex justify-center items-center p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full object-contain rounded-xl"
                  />
                </div>

                {/* Content */}
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
                {/* Add to Cart */}
                <button
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-red-600 transition"
                  onClick={() => {
                    if (!item._id) return showPopup("⚠️ Product ID missing");
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
                    if (!item._id) return showPopup("⚠️ Product ID missing");
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
          onClick={() => scroll(300)}
          aria-label="scroll right"
        >
          ❯
        </button>
      </div>
    </section>
  );
}
