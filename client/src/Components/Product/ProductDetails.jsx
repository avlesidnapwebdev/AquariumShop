import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../../Main/Constant/AddToCart.jsx";
import { useWishlist } from "../../Main/Constant/Wishlist.jsx";
import { useNavigate } from "react-router-dom";
import Stars from "../../Main/Constant/Stars.jsx";

export default function ProductDetails({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  // ✅ Popup message state
  const [popupMessage, setPopupMessage] = useState("");
  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  // ✅ Tabs state
  const [activeTab, setActiveTab] = useState("description");

  // ✅ Handle Buy Now → redirect to buy now page
  const handleBuyNow = () => {
    const buyItem = { ...product, qty };
    addToCart(buyItem); // optional: keep in cart also
    navigate("/buy-now", { state: { cartItems: [buyItem] } });
  };

  // ✅ Handle Add to Cart
  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    showPopup(`✅ ${qty} × ${product.name} added to Cart`);
  };

  // ✅ Handle Add to Wishlist
  const handleAddToWishlist = () => {
    addToWishlist(product);
    showPopup(`❤️ ${product.name} added to Wishlist`);
  };

  return (
    <div className="relative">
      {/* ✅ Popup Notification */}
      {popupMessage && (
        <div className="fixed top-24 right-5 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8 items-start">
        {/* ✅ Product Image */}
        <div className="border p-4 rounded-lg flex items-center justify-center w-full max-w-md h-auto mx-auto">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* ✅ Product Info */}
        <div className="w-full">
          <h1 className="text-2xl font-bold uppercase mb-2 text-blue-500">{product.name}</h1>
          <p className="text-blue-700 text-3xl font-semibold mb-2">
            ₹{product.price}
          </p>

          {/* ✅ Star Rating */}
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={product.rating} />
            <span className="text-gray-600 text-sm">
              ({product.reviews?.length || product.reviews} Reviews)
            </span>
          </div>

          <p className="mb-2 text-gray-700">
            Available: {product.stock}/{product.totalStock}
          </p>

          {/* ✅ Quantity Selector */}
<div className="flex items-center gap-2 my-4">
  {/* Decrease */}
  <button
    onClick={() => setQty(Math.max(1, qty - 1))}
    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-red-600"
  >
    -
  </button>

  {/* Editable Input */}
  <input
    type="number"
    value={qty}
    onChange={(e) => {
      const val = parseInt(e.target.value, 10);
      setQty(isNaN(val) || val < 1 ? 1 : val);
    }}
    className="w-16 text-center border border-gray-300 rounded-lg py-1 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
    min="1"
  />

  {/* Increase */}
  <button
    onClick={() => setQty(qty + 1)}
    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
  >
    +
  </button>
</div>


          {/* ✅ Action Buttons */}
          <div className="flex items-center gap-4 my-4">
            <button
              onClick={handleBuyNow}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="p-2 border rounded hover:bg-red-100"
            >
              <FaHeart className="text-red-500" />
            </button>
          </div>

          {/* ✅ Categories & Tags */}
          <p className="text-gray-600">Category: {product.category}</p>
          <p className="text-gray-600">
            Tags: {product.tags && product.tags.join(", ")}
          </p>

          {/* ✅ Tabs */}
          <div className="my-8">
            <div className="flex gap-6 border-b pb-2 mb-4">
              <button
                onClick={() => setActiveTab("description")}
                className={`font-semibold ${
                  activeTab === "description"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("additional")}
                className={`font-semibold ${
                  activeTab === "additional"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
              >
                Additional Info
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`font-semibold ${
                  activeTab === "reviews"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
              >
                Reviews ({product.reviews?.length || product.reviews})
              </button>
            </div>

            {/* ✅ Tab Content */}
            {activeTab === "description" && (
              <p className="text-gray-700">{product.description}</p>
            )}

            {activeTab === "additional" && (
              <div className="text-gray-700">
                {product.additionalInfo ? (
                  <ul className="list-disc ml-6">
                    {product.additionalInfo.map((info, i) => (
                      <li key={i}>{info}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No additional information available.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-gray-700">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                      {product.reviews.map((rev, i) => (
                        <li
                          key={i}
                          className="border p-3 rounded shadow-sm bg-gray-50"
                        >
                          ⭐ {rev.rating} – {rev.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
