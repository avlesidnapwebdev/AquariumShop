// src/Main/Constant/Order.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyOrders } from "../../api/api.js";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const backendOrders = await getMyOrders();
      setOrders(backendOrders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Add order locally (after payment success)
  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  const clearOrders = () => setOrders([]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders, fetchOrders, loading }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
