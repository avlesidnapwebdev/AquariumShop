// OrderTrack.jsx
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderTrack() {
  // Sample Orders (replace with backend API later)
  const orders = [
    {
      orderId: "ORD123",
      product: "iPhone 15 Pro",
      steps: [
        { id: 1, title: "Order Confirmed", date: "2025-09-10", time: "10:30 AM", completed: true },
        { id: 2, title: "Shipped", date: "2025-09-11", time: "02:15 PM", completed: true },
        { id: 3, title: "Out for Delivery", date: "2025-09-12", time: "09:00 AM", completed: true },
        { id: 4, title: "Delivered", date: "2025-09-12", time: "04:45 PM", completed: false },
      ],
    },
    {
      orderId: "ORD456",
      product: "Samsung Galaxy S24",
      steps: [
        { id: 1, title: "Order Confirmed", date: "2025-09-08", time: "11:00 AM", completed: true },
        { id: 2, title: "Shipped", date: "2025-09-09", time: "03:20 PM", completed: true },
        { id: 3, title: "Out for Delivery", date: "2025-09-10", time: "07:30 AM", completed: false },
        { id: 4, title: "Delivered", date: "-", time: "-", completed: false },
      ],
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSearch = () => {
    const found = orders.find((order) => order.orderId === search.trim());
    setSelectedOrder(found || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Order Tracking
        </h2>

        {/* Search Bar */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Enter Order Number (e.g., ORD123)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-l-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="px-5 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Show result */}
        {selectedOrder ? (
          <>
            {/* Product Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Order ID: <span className="text-blue-600">{selectedOrder.orderId}</span>
              </h3>
              <p className="text-gray-600">Product: {selectedOrder.product}</p>
            </div>

            {/* Tracking Steps */}
            <div className="relative pl-8">
              {selectedOrder.steps.map((step, index) => (
                <div key={step.id} className="relative mb-8 last:mb-0">
                  {/* Line */}
                  {index < selectedOrder.steps.length - 1 && (
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-blue-500"></div>
                  )}

                  {/* Circle/Icon */}
                  <div
                    className={`absolute -left-9 top-0 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                    }`}
                  >
                    {step.completed ? <FaCheckCircle className="text-white" /> : ""}
                  </div>

                  {/* Step Info */}
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        step.completed ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {step.date} • {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">Enter an order number to track your product.</p>
        )}

        {/* Not found case */}
        {search && !selectedOrder && (
          <p className="text-red-500 text-center mt-4">❌ Order not found!</p>
        )}

        {/* Bottom Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Thank you for shopping with{" "}
            <span className="text-blue-600 font-bold">AquaShop</span> 💙
          </p>
        </div>
      </div>
    </div>
  );
}
