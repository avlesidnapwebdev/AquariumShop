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

  const addToWishlist = async (product) => {
    const productId = product?._id || product?.id;
    if (!productId) throw new Error("Invalid product");
    await apiAddToWishlist(productId);
    setWishlistItems((prev) => prev.some((p) => (p._id || p.id) === productId) ? prev : [...prev, product]);
  };

  const removeFromWishlist = async (productId) => {
    await apiRemoveFromWishlist(productId);
    setWishlistItems((prev) => prev.filter((p) => (p._id || p.id) !== productId));
  };

  const clearWishlistItems = async () => {
    await apiClearWishlist();
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, addToWishlist, removeFromWishlist, clearWishlist: clearWishlistItems, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
