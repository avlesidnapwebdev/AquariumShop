import React, { useEffect, useRef, useState } from "react";
import { useWishlist } from "./Wishlist.jsx"; // adjust path
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function WishlistSidebar({ wishlistOpen, toggleWishlist }) {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [clearing, setClearing] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleWishlist();
      }
    };

    if (wishlistOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // prevent background scroll
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [wishlistOpen, toggleWishlist]);

  const goToFullWishlist = () => {
    toggleWishlist();
    navigate("/wishlist");
  };

  const handleClear = async () => {
    try {
      setClearing(true);
      await clearWishlist(); // calls API and clears state
      setClearing(false);
      // optionally close sidebar after clearing
      toggleWishlist();
    } catch (err) {
      console.error("Clear wishlist failed:", err);
      setClearing(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error("Remove from wishlist failed:", err);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-[90vh] w-80 z-50 transform transition-transform duration-300 ease-in-out ${
        wishlistOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div ref={sidebarRef} className="relative h-full w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-blue-600">My Wishlist</h2>
          <button onClick={toggleWishlist} className="text-blue-500 font-extrabold hover:text-red-500">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
          {wishlistItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your wishlist is empty.</p>
          ) : (
            wishlistItems.map((item) => {
              const id = item._id || item.id || item.productId;
              return (
                <div key={id} className="flex items-center justify-between gap-3 mb-3 border-b pb-2">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-600 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">${item.price}</p>
                  </div>
                  <button onClick={() => handleRemove(id)} className="text-red-500 hover:text-red-700 p-1 rounded-md transition" title="Remove from wishlist">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <button onClick={goToFullWishlist} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
              Full View
            </button>
            <button onClick={handleClear} disabled={clearing} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
              {clearing ? "Clearing..." : "Clear Wishlist"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
