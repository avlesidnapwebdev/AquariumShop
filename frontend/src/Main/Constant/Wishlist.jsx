import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  clearWishlist as apiClearWishlist,
} from "../../api/api.js";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await apiGetWishlist();
      setWishlistItems(res.data?.products || []);
    } catch (err) {
      console.error("❌ Failed to load wishlist:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 🔹 Add item
  const addToWishlist = async (product) => {
    try {
      const productId = product?._id || product?.id;
      if (!productId) throw new Error("Invalid product");

      await apiAddToWishlist(productId);

      setWishlistItems((prev) =>
        prev.some((p) => (p._id || p.id) === productId) ? prev : [...prev, product]
      );
    } catch (err) {
      console.error("❌ Add to wishlist failed:", err);
      throw err;
    }
  };

  // 🔹 Remove item
  const removeFromWishlist = async (productId) => {
    try {
      await apiRemoveFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((p) => (p._id || p.id) !== productId)
      );
    } catch (err) {
      console.error("❌ Remove from wishlist failed:", err);
      throw err;
    }
  };

  // 🔹 Clear wishlist
  const clearWishlistItems = async () => {
    try {
      await apiClearWishlist();
      setWishlistItems([]);
    } catch (err) {
      console.error("❌ Clear wishlist failed:", err);
      throw err;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist: clearWishlistItems,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
