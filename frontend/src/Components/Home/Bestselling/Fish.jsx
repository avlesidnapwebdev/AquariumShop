import React, { useRef, useEffect, useState } from "react";
import { getProducts } from "../../../api/api.js"; // ✅ backend fetch
import { useCart } from "../../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../../Main/Constant/Wishlist.jsx";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Fish() {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const scrollRef = useRef();
  const [popupMessage, setPopupMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch only Fish category products
  useEffect(() => {
    async function fetchFishProducts() {
      try {
        const allProducts = await getProducts(); // ✅ Corrected here

        // Filter for Fish category only
        const fishProducts = allProducts.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase().includes("fish")
        );

        setProducts(fishProducts);
      } catch (err) {
        console.error("Error fetching fish products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFishProducts();
  }, []);

  // ✅ Scroll functions
  const scroll = (scrollOffset) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += scrollOffset;
  };

  // ✅ Show popup for 2 seconds
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  // ✅ Infinite scroll setup
  const infiniteFishData = [...products, ...products, ...products];

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
  }, [products]);

  // ✅ Price formatter
  function formatPrice(price) {
    return price ? `₹ ${price.toLocaleString("en-IN")}` : "₹ 0";
  }

  return (
    <section className="w-full min-h-auto bg-gradient-to-tr from-sky-400 to-blue-600 py-10 relative">
      {/* Popup */}
      {popupMessage && (
        <div className="fixed top-24 right-5 transform -translate-x-3.5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-20">
        <h3 className="text-white text-xl md:text-2xl font-semibold underline uppercase">
          Best Selling Fish:
        </h3>
      </div>

      {/* Loading or No Data */}
      {loading ? (
        <div className="text-center py-10 text-white font-semibold text-lg">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-white font-semibold text-lg">
          No fish products found.
        </div>
      ) : (
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
            {infiniteFishData.map((item, index) => (
              <div
                key={`${item._id || index}-${index}`}
                className="relative group flex-none w-56 sm:w-64 md:w-72 h-auto rounded-xl bg-white shadow-md flex flex-col transition-transform transform-gpu hover:scale-105 hover:z-20"
              >
                <Link to={`/product/${item._id}`}>
                  <div className="h-40 flex justify-center items-center p-4">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="max-h-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <p className="bg-blue-600 text-white font-bold text-sm md:text-base rounded-r-md px-3 py-1 w-fit">
                      {formatPrice(item.price)}
                    </p>
                    <h4 className="text-blue-600 font-bold text-lg mt-2 capitalize line-clamp-2 py-3 px-2">
                      {item.name}
                    </h4>
                  </div>
                </Link>

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
            onClick={() => scroll(300)}
            aria-label="scroll right"
          >
            ❯
          </button>
        </div>
      )}
    </section>
  );
}
