import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";

export default function BuyNow() {
  const location = useLocation();
  const items = location.state?.cartItems || [];

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="h-[100px]"></div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold">No product selected</h2>
          <Link to="/shop" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const grandTotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      <Header />
      <div className="h-[100px]"></div>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Buy Now</h1>

        {/* Product list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id || item.id} className="border rounded-lg shadow-md bg-white overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-40 object-contain p-2" />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-blue-600">{item.name}</h2>
                <p className="text-purple-600 font-bold mt-1">₹{item.price} × {item.qty}</p>
                <p className="text-gray-600 mt-2">Subtotal: ₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-8 flex justify-between items-center border-t pt-4 text-lg font-bold">
          <span>Grand Total:</span>
          <span>₹ {grandTotal}</span>
        </div>

        {/* Next Step */}
        <div className="mt-6 flex gap-4 flex-wrap">
          <Link to="/checkout" state={{ cartItems: items, grandTotal }}>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Proceed to Checkout
            </button>
          </Link>
          <Link to="/shop" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
            Cancel
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
