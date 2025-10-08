// src/context/WishlistContext.jsx  (adjust path to your project)
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

  // Load wishlist on mount (or when user logs in you may re-run)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiGetWishlist();
        // res.data is wishlist object -> use res.data.products (populated)
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

  // Add product (DB + update state)
  const addToWishlist = async (product) => {
    try {
      if (!product?._id) throw new Error("Invalid product");
      await apiAddToWishlist(product._id);
      // Push product to local state (keep fields consistent)
      setWishlistItems((prev) => {
        if (prev.some((p) => (p._id || p.id || p.productId) === product._id)) return prev;
        return [...prev, product];
      });
    } catch (err) {
      console.error("❌ Add to wishlist failed:", err);
      throw err;
    }
  };

  // Remove product (DB + update state)
  const removeFromWishlist = async (productId) => {
    try {
      if (!productId) throw new Error("productId is required");
      await apiRemoveFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((p) => (p._id || p.id || p.productId) !== productId));
    } catch (err) {
      console.error("❌ Remove from wishlist failed:", err);
      throw err;
    }
  };

  // Clear entire wishlist (DB + local state)
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
