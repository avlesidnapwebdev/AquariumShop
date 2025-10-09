import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  clearCart as apiClearCart,
} from "../../api/api.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await apiGetCart();
      const items =
        res.data?.products?.map((p) => ({
          id: p.product?._id,
          name: p.product?.name || "Unknown Product",
          price: p.product?.price || 0,
          image: p.product?.image || "",
          qty: p.quantity || 1,
        })) || [];
      setCart(items);
    } catch (err) {
      console.error("❌ Fetch cart failed:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔹 Add to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      if (!product?._id) throw new Error("Invalid product");
      await apiAddToCart({ productId: product._id, quantity });
      await fetchCart();
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      throw err;
    }
  };

  // 🔹 Update quantity
  const updateQty = async (id, qty) => {
    try {
      await apiUpdateCartItem(id, { quantity: qty });
      await fetchCart();
    } catch (err) {
      console.error("❌ Update cart item failed:", err);
      throw err;
    }
  };

  // 🔹 Remove item
  const removeFromCart = async (id) => updateQty(id, 0);

  // 🔹 Clear cart
  const clearCartItems = async () => {
    try {
      await apiClearCart();
      setCart([]);
    } catch (err) {
      console.error("❌ Clear cart failed:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart: clearCartItems,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
