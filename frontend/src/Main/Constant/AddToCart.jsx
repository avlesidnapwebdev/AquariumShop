import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  clearCart as apiClearCart,
} from "../../api/api.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      const items =
        res?.data?.products?.map((p) => ({
          id: p.product?._id,
          name: p.product?.name || "Unknown Product",
          price: p.product?.price || 0,
          image: p.product?.image || "",
          qty: p.quantity || 1,
        })) || [];
      setCart(items);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      if (!product?._id) {
        console.error("❌ Cannot add to cart: product._id is missing");
        return;
      }

      await apiAddToCart({ productId: product._id, quantity });
      await fetchCart();
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
    }
  };

  // Update quantity of cart item
  const updateQty = async (id, qty) => {
    try {
      if (!id) {
        console.error("❌ Cannot update cart: id is missing");
        return;
      }

      await apiUpdateCartItem(id, { quantity: qty });
      await fetchCart();
    } catch (err) {
      console.error("❌ Update cart item failed:", err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      if (!id) {
        console.error("❌ Cannot remove from cart: id is missing");
        return;
      }

      await apiUpdateCartItem(id, { quantity: 0 });
      await fetchCart();
    } catch (err) {
      console.error("❌ Remove cart item failed:", err);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await apiClearCart();
      setCart([]);
    } catch (err) {
      console.error("❌ Clear cart failed:", err);
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
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
