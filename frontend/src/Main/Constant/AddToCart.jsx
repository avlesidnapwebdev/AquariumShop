// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, clearCart as apiClearCart } from "../../api/api.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on login / mount
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data.products.map(p => ({
        id: p.product._id,
        name: p.product.name,
        price: p.product.price,
        image: p.product.image,
        qty: p.quantity,
      })));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (product) => {
    try {
      const quantity = product.qty ? Number(product.qty) : 1;
      await apiAddToCart(product.id, quantity);
      // Update frontend state
      setCart(prev => {
        const existing = prev.find(p => p.id === product.id);
        if (existing) {
          return prev.map(p =>
            p.id === product.id ? { ...p, qty: p.qty + quantity } : p
          );
        } else {
          return [...prev, { ...product, qty: quantity }];
        }
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  // Update quantity
  const updateQty = async (id, qty) => {
    try {
      await apiUpdateCartItem(id, qty);
      setCart(prev =>
        prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
      );
    } catch (err) {
      console.error("Update cart item failed:", err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      await apiUpdateCartItem(id, 0); // backend removes if qty <= 0
      setCart(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Remove cart item failed:", err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await apiClearCart();
      setCart([]);
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
