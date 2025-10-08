import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Products({ products = [], view = "grid" }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [popupMessage, setPopupMessage] = useState("");
  const [productList, setProductList] = useState([]);

  // Initialize product list safely
  useEffect(() => {
    if (!products) return;
    if (products.data && Array.isArray(products.data)) {
      setProductList(products.data);
    } else if (Array.isArray(products)) {
      setProductList(products);
    } else {
      setProductList([]);
    }
  }, [products]);

  // Show popup for 2 seconds
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  if (!productList || productList.length === 0) {
    return <p className="text-center py-10 text-gray-700">No products found.</p>;
  }

  return (
    <div>
      {/* Popup */}
      {popupMessage && (
        <div className="fixed top-24 right-5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {productList.map((product) => (
            <div
              key={product._id || product.id}
              className="relative group rounded-xl bg-white shadow-md flex flex-col transition-transform transform hover:scale-105"
            >
              {/* Product Link */}
              <Link to={`/product/${product._id || product.id}`} className="block flex-1">
                {/* Image */}
                <div className="h-48 flex justify-center items-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-2">
                  <p className="bg-blue-600 text-white font-bold text-sm rounded-r-md px-3 py-1 w-fit">
                    ₹ {product.price}
                  </p>
                  <h4 className="text-blue-600 font-bold text-base mt-2 line-clamp-2">
                    {product.name}
                  </h4>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex justify-around items-center w-full border-t p-2">
                <button
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-red-600 transition"
                  onClick={() => {
                    addToCart({ ...product, qty: 1 });
                    showPopup(`✅ ${product.name} added to Cart`);
                  }}
                >
                  <FiShoppingCart size={20} />
                  <span className="hidden sm:inline">Cart</span>
                </button>
                <button
                  className="flex items-center gap-2 text-blue-500 hover:text-red-600 font-semibold transition"
                  onClick={() => {
                    addToWishlist(product);
                    showPopup(`❤️ ${product.name} added to Wishlist`);
                  }}
                >
                  <FaHeart size={20} />
                  <span className="hidden sm:inline">Wishlist</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {productList.map((product) => (
            <div
              key={product._id || product.id}
              className="flex items-center gap-4 bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              {/* Image */}
              <Link to={`/product/${product._id || product.id}`}>
                <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1">
                <Link to={`/product/${product._id || product.id}`}>
                  <h3 className="font-semibold text-blue-600 hover:underline">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-500">₹ {product.price}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-1 text-blue-600 font-semibold hover:text-red-600 transition"
                  onClick={() => {
                    addToCart({ ...product, qty: 1 });
                    showPopup(`✅ ${product.name} added to Cart`);
                  }}
                >
                  <FiShoppingCart size={20} /> Cart
                </button>
                <button
                  className="flex items-center gap-1 text-blue-500 hover:text-red-600 font-semibold transition"
                  onClick={() => {
                    addToWishlist(product);
                    showPopup(`❤️ ${product.name} added to Wishlist`);
                  }}
                >
                  <FaHeart size={20} /> Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
