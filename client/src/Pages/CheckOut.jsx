// src/Components/Pages/CheckOut.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import { useCart } from "../Main/Constant/AddToCart.jsx";
import { useOrders } from "../Main/Constant/Order.jsx";

export default function CheckOut() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateItems = location.state?.cartItems || []; // ✅ From OrderPage
  const stateTotal = location.state?.grandTotal || 0;

  const { cartItems: cartCtx, clearCart } = useCart();
  const { addOrder } = useOrders();

  // ✅ Choose state items first, else context
  const items = stateItems.length > 0 ? stateItems : cartCtx;
  const subtotal =
    stateItems.length > 0
      ? stateTotal
      : cartCtx.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [formData, setFormData] = useState({
    fullName: "",
    country: null,
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [showPayment, setShowPayment] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const countries = [
    { value: "US", label: "United States" },
    { value: "IN", label: "India" },
    { value: "GB", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "PH", label: "Philippines" },
  ];

  // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Form handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Card handler
  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setCard({ ...card, [name]: value });
  };

  // Handle payment
  const handlePay = () => {
    if (
      card.number.length !== 16 ||
      card.expiry.length !== 5 ||
      card.cvv.length !== 3
    ) {
      alert("Please enter valid card details!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newOrders = items.map((item) => ({
        id: Date.now() + "-" + item.id,
        title: item.name || item.title,
        image: item.image,
        qty: item.qty,
        price: item.price,
        deliveryDate: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        rating: 0,
      }));

      // ✅ Move purchased items to MyOrdersSidebar
      if (typeof addOrder === "function") {
        newOrders.forEach((order) => addOrder(order));
      }

      // ✅ Clear cart after placing order
      clearCart();

      setLoading(false);
      setShowPayment(false);
      setOrderPlaced(true);
    }, 2000);
  };

  // After popup close → redirect user
  const handleContinueShopping = () => {
    setOrderPlaced(false);
    navigate("/shop"); // redirect to shop (or home)
  };

  return (
    <>
      <Header />
      <div className="h-[95px] bg-white"></div>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Billing Details */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-6">Billing details</h2>
            <div className="space-y-6">
              <label className="block text-sm font-medium">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg"
                placeholder="Your full name"
              />
              <div>
                <label className="block text-sm font-medium">
                  Country / Region *
                </label>
                <Select
                  options={countries}
                  value={formData.country}
                  onChange={(selected) =>
                    setFormData({ ...formData, country: selected })
                  }
                  className="mt-2"
                  placeholder="Select a country"
                  isSearchable
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Street address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-lg"
                  placeholder="House number and street name"
                />
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full mt-3 p-3 border rounded-lg"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">ZIP Code *</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Additional information
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-lg"
                  placeholder="Notes about your order"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Your order</h2>
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {item.name || item.title} (x{item.qty})
                    </span>
                  </div>
                  <span className="text-sm">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 flex items-center justify-center text-blue-500 bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <input
              type="text"
              name="number"
              value={card.number}
              onChange={handleCardChange}
              placeholder="Card Number (16 digits)"
              className="w-full mb-3 p-3 border rounded-lg"
            />
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                name="expiry"
                value={card.expiry}
                onChange={handleCardChange}
                placeholder="MM/YY"
                className="w-1/2 p-3 border rounded-lg"
              />
              <input
                type="text"
                name="cvv"
                value={card.cvv}
                onChange={handleCardChange}
                placeholder="CVV"
                className="w-1/2 p-3 border rounded-lg"
              />
            </div>
            <button
              onClick={handlePay}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Order Placed Popup */}
      {orderPlaced && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center w-full max-w-md relative">
            <button
              onClick={handleContinueShopping}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Order Placed Successfully!
            </h2>
            <p className="mb-6 text-gray-700">
              Thank you for your purchase. We’re preparing your order.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
