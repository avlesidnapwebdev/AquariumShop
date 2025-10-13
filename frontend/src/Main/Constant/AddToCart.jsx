import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  clearCart as apiClearCart,
} from "../../api/api.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await apiGetCart();
      const items = res.data?.products?.map((p) => ({
        id: p.product?._id || p.product?.id,
        name: p.product?.name || "Unknown Product",
        price: p.product?.price || 0,
        image: p.product?.image || "",
        qty: p.quantity || 1,
      })) || [];
      setCartItems(items);
    } catch (err) {
      console.error("❌ Fetch cart failed:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const productId = product?._id || product?.id;
    if (!productId) throw new Error("Invalid product");
    await apiAddToCart({ productId, quantity });
    await fetchCart();
  };

  const updateQty = async (id, qty) => {
    if (!id) throw new Error("Product ID required");
    await apiUpdateCartItem(id, { quantity: qty });
    await fetchCart();
  };

  const removeFromCart = async (id) => updateQty(id, 0);

  const clearCart = async () => {
    await apiClearCart();
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, updateQty, removeFromCart, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
