import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import { useCart } from "../Main/Constant/AddToCart.jsx";

export default function BuyNow() {
  const { cartItems } = useCart();
  const location = useLocation();
  const items = location.state?.cartItems || cartItems;

  // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (!items || items.length === 0) {
    return (
      <>
        <Header />
        <div className="h-[100px]"></div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold">No products selected</h2>
          <Link
            to="/shop"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const grandTotal = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <>
      <Header />
      <div className="h-[100px]"></div>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Buy Now</h1>

        {/* Items in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-lg transition"
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-contain p-2 rounded-md"
              />

              {/* Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-blue-600 line-clamp-1">
                  {item.name}
                </h2>
                <p className="text-purple-600 font-bold mt-1">
                  ₹{item.price} × {item.qty}
                </p>
                <p className="text-gray-600 mt-2">
                  Subtotal:{" "}
                  <span className="font-semibold text-black">
                    ₹{item.price * item.qty}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-8 flex justify-between items-center border-t pt-4">
          <span className="text-lg font-bold text-white">Grand Total:</span>
          <span className="text-2xl font-bold text-white">₹ {grandTotal}</span>
        </div>

        {/* Next Step */}
        <div className="mt-6 flex gap-4 flex-wrap">
          <Link to="/order" state={{ cartItems: items, grandTotal }}>
            <button className="bg-green-600 font-bold text-white px-6 py-2 rounded hover:bg-green-700">
              Go to Order Page
            </button>
          </Link>
          <Link
            to="/shop"
            className="bg-red-500 font-bold text-white px-6 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </div>
      <div className="h-[76px]"></div>
      <Footer />
    </>
  );
}
