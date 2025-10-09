<<<<<<< HEAD
=======
// src/Main/Constant/Order.jsx
>>>>>>> dcbb200471f9bd17860fb2583d34cf4feb40f70e

import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyOrders } from "../../api/api.js";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
<<<<<<< HEAD
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };
=======
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

  // Add order locally (after payment success)
  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  const clearOrders = () => setOrders([]);
>>>>>>> dcbb200471f9bd17860fb2583d34cf4feb40f70e

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
<<<<<<< HEAD
    <OrderContext.Provider
      value={{ orders, loadingOrders, fetchOrders, addOrder }}
    >
=======
    <OrderContext.Provider value={{ orders, addOrder, clearOrders, fetchOrders, loading }}>
>>>>>>> dcbb200471f9bd17860fb2583d34cf4feb40f70e
    <OrderContext.Provider
      value={{ orders, addOrder, clearOrders, fetchOrders, loading }}
    >
      {children}
    </OrderContext.Provider>
  );
};
};

export const useOrders = () => useContext(OrderContext);
export const useOrders = () => useContext(OrderContext);
