// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
 
export function CartProvider({ children }) {
  // load initial value from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to read cart from localStorage:", e);
      return [];
    }
  });

  // persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart]);

  // Add to cart (increments qty if already exists)
  const addToCart = (product) => {
    setCart((prev) => {
      const qtyToAdd =
        product.qty && Number(product.qty) > 0 ? Number(product.qty) : 1;
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, qty: Number(p.qty || 1) + qtyToAdd }
            : p
        );
      } else {
        return [...prev, { ...product, qty: qtyToAdd }];
      }
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
