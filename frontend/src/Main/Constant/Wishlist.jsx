import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  clearWishlist as apiClearWishlist,
} from "../../api/api.js"; // adjust path if needed

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount
  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  // ✅ Add product to wishlist
  const addToWishlist = async (product) => {
    try {
      const productId = product?._id || product?.id || product?.productId;
      if (!productId) throw new Error("Invalid product");

      await apiAddToWishlist(productId);

      // Update local state
      setWishlistItems((prev) => {
        if (prev.some((p) => (p._id || p.id || p.productId) === productId)) return prev;
        return [...prev, product];
      });

      console.log("✅ Added to wishlist:", product.name || product.title);
    } catch (err) {
      console.error("❌ Add to wishlist failed:", err);
      throw err;
    }
  };

  // Remove product
  const removeFromWishlist = async (productId) => {
    try {
      if (!productId) throw new Error("productId is required");
      await apiRemoveFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((p) => (p._id || p.id || p.productId) !== productId)
      );
    } catch (err) {
      console.error("❌ Remove from wishlist failed:", err);
      throw err;
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
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
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
