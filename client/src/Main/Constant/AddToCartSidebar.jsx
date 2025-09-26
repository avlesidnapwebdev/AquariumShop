import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTrash, FaHeart } from "react-icons/fa";
import { useCart } from "./AddToCart.jsx";
import { useWishlist } from "./Wishlist.jsx";
import { useNavigate } from "react-router-dom";

export default function AddToCartSidebar({ cartOpen, toggleCart }) {
  const { cartItems, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const totalPrice = (cartItems || []).reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const handlePurchase = () => {
    toggleCart();
    navigate("/buy-now", { state: { cartItems } });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-[90vh] w-80 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <button
        className="absolute top-4 right-4 text-2xl text-blue-600"
        onClick={toggleCart}
      >
        <IoClose />
      </button>

      <h2 className="text-xl font-bold p-6 border-b text-blue-500">My Cart</h2>

      <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">
        {!cartItems || cartItems.length === 0 ? (
          <p className="text-red-600">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b py-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold text-blue-500 line-clamp-1">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-red-500">
                  ₹ {item.price} × {item.qty}
                </p>
                <p className="text-sm text-gray-600">
                  Subtotal: ₹ {Number(item.price) * Number(item.qty)}
                </p>

                <button
                  onClick={() => addToWishlist(item)}
                  className="flex items-center gap-1 text-sm mt-2 text-pink-600 hover:text-pink-800"
                >
                  <FaHeart /> Add to Wishlist
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems && cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-blue-600">Total:</span>
            <span className="font-bold text-red-600 text-lg">
              ₹ {totalPrice}
            </span>
          </div>

          <button
            onClick={handlePurchase}
            className="w-full block text-center bg-blue-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg transition"
          >
            Purchase Now
          </button>
        </div>
      )}
    </div>
  );
}
