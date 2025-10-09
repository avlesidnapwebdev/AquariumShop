// src/Main/Constant/Order.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyOrders } from "../../api/api.js";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new order locally (after payment)
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  // Clear all orders (e.g., on logout)
  const clearOrders = () => setOrders([]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, clearOrders, fetchOrders, loading }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
