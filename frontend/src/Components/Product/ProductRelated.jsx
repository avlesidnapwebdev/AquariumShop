import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";
import { getProducts } from "../../api/api.js";

export default function ProductRelated({ currentProductId }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const scrollRef = useRef();

  const [products, setProducts] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProducts();

        // Exclude current product
        const filtered = data.filter(p => p._id !== currentProductId);

        // Shuffle products randomly
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());

        setProducts(shuffled.slice(0, 12)); // show max 12 products
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentProductId]);

  // Scroll function
  const scroll = (scrollOffset) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += scrollOffset;
  };

  // Popup
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  if (loading) {
    return (
      <div className="w-full py-10 flex justify-center text-white bg-blue-600 text-lg">
        Loading related products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="w-full py-10 flex justify-center text-white bg-blue-600 text-lg">
        No related products found.
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-tr from-sky-400 to-blue-600 py-10 relative mt-10">
      {/* Popup */}
      {popupMessage && (
        <div className="fixed top-20 right-5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-20">
        <h3 className="text-white text-xl md:text-2xl font-semibold underline uppercase">
          You Might Like
        </h3>
      </div>

      {/* Carousel */}
      <div className="relative w-full mt-6 overflow-visible">
        {/* Left Arrow */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-50 hover:bg-blue-600 transition"
          onClick={() => scroll(-300)}
        >
          ❮
        </button>

        {/* Product Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 px-4 md:px-10 scroll-smooth cursor-grab active:cursor-grabbing no-scrollbar items-center overflow-x-auto overflow-y-visible py-10"
        >
          {products.map((item, index) => (
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

              {/* Actions */}
              <div className="flex justify-around items-center w-full border-t p-2">
                <button
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-red-600 transition"
                  onClick={() => {
                    addToCart({ ...item, qty: 1 });
                    showPopup("✅ Added to Cart");
                  }}
                >
                  <FiShoppingCart size={20} />
                  <span className="hidden sm:inline">Cart</span>
                </button>

                <button
                  className="flex items-center gap-2 text-pink-600 hover:text-red-600 font-semibold transition"
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

        {/* Right Arrow */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white text-2xl md:text-3xl rounded-full px-3 py-1 z-20 hover:bg-blue-600 transition"
          onClick={() => scroll(300)}
        >
          ❯
        </button>
      </div>
    </section>
  );
}
