// src/Components/Pages/MyOrderSideBar.jsx
import React, { useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { useOrders } from "./Order.jsx";

export default function MyOrderSideBar({ open, setOpen }) {
  const sidebarRef = useRef(null);
  const ordersContext = useOrders();
  const orders = ordersContext?.orders || [];
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={() => setOpen(false)}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">My Orders</h2>
          <button
            className="text-2xl text-blue-600"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Orders list (scrollable) */}
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-70px)] scrollbar-thin scrollbar-thumb-gray-300">
          {orders.length === 0 ? (
            <p className="text-red-600">No orders yet</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center text-blue-500 gap-4 border-b py-4"
              >
                {/* Product Image */}
                {order.image ? (
                  <img
                    src={order.image}
                    alt={order.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold">{order.title}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {order.qty} × ₹{order.price}
                  </p>
                  <p className="text-sm font-medium text-black">
                    Delivery: {order.deliveryDate}
                  </p>

                  {/* Rating placeholder */}
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < (order.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
