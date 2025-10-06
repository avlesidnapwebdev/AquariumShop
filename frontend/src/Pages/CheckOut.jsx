// src/Components/Pages/CheckOut.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import { useCart } from "../Main/Constant/AddToCart.jsx";
import { useOrders } from "../Main/Constant/Order.jsx";
import SaveCards from "../Main/Constant/SaveCards.jsx";
import SaveAddress from "../Main/Constant/SaveAddress.jsx";
import {
  placeOrder,
  getProfile,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/api.js";

export default function CheckOut() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems: cartCtx, clearCart } = useCart();
  const { addOrder } = useOrders();

  const stateItems = location.state?.cartItems || [];
  const stateTotal = location.state?.grandTotal || 0;

  const items = stateItems.length > 0 ? stateItems : cartCtx;
  const subtotal =
    stateItems.length > 0
      ? stateTotal
      : cartCtx.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [addressSidebar, setAddressSidebar] = useState(false);
  const [cardSidebar, setCardSidebar] = useState(false);

  // Scroll top on load
  useEffect(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), []);

  // Fetch user profile (addresses + cards)
  const fetchProfile = async () => {
    try {
      const { data } = await getProfile();
      setAddresses(data.addresses || []);
      setCards(data.cards || []);
    } catch (err) {
      console.error("Fetch profile failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle payment
  const handlePay = async () => {
    if (!selectedCard || !selectedAddress) {
      alert("Please select an address and a card to continue!");
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ Create Order
      const orderResponse = await createRazorpayOrder({
        items,
        amount: subtotal,
        addressId: selectedAddress._id,
        cardId: selectedCard._id,
      });

      const { order_id, amount, currency } = orderResponse.data;

      // 2️⃣ Open Razorpay payment popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: "My Shop",
        description: "Test Transaction",
        order_id: order_id,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment
            await verifyRazorpayPayment(response);

            // 4️⃣ Place Order in backend DB
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

            newOrders.forEach((order) => addOrder(order));
            await placeOrder({
              items: newOrders,
              amount: subtotal,
              addressId: selectedAddress._id,
              cardId: selectedCard._id,
            });

            // 5️⃣ Clear cart
            clearCart();

            setShowPayment(false);
            setOrderPlaced(true);
          } catch (err) {
            console.error("Payment verification or order placement failed:", err);
            alert("Payment failed or verification error");
          }
        },
        prefill: {
          name: selectedAddress.name,
          email: selectedAddress.email || "",
          contact: selectedAddress.phone,
        },
        theme: {
          color: "#F97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    setOrderPlaced(false);
    navigate("/shop");
  };

  return (
    <>
      <Header />
      <div className="h-[95px] bg-white"></div>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Billing & Address */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow space-y-6">
            <h2 className="text-2xl font-semibold">Billing & Shipping</h2>
            <button
              onClick={() => setAddressSidebar(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Select Shipping Address
            </button>
            {selectedAddress && (
              <div className="p-4 border rounded-lg mt-2">
                <p className="font-semibold">{selectedAddress.name}</p>
                <p>
                  {selectedAddress.addressLine1}, {selectedAddress.addressLine2},{" "}
                  {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country} -{" "}
                  {selectedAddress.pincode}
                </p>
                <p>Phone: {selectedAddress.phone}</p>
              </div>
            )}
            <button
              onClick={() => setCardSidebar(true)}
              className="w-full bg-orange-500 text-white py-2 rounded-lg mt-4"
            >
              Select Payment Card
            </button>
            {selectedCard && (
              <div className="p-4 border rounded-lg mt-2">
                <p className="font-semibold">{selectedCard.brand}</p>
                <p>**** **** **** {selectedCard.last4}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Your order</h2>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{item.name || item.title} (x{item.qty})</span>
                  <span>₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium py-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg py-2">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <button
              onClick={handlePay}
              className="w-full bg-green-500 text-white py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay ₹" + subtotal.toFixed(2)}
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
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
            <p className="mb-6 text-gray-700">Thank you for your purchase!</p>
            <button
              onClick={handleContinueShopping}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Sidebars */}
      <SaveAddress
        open={addressSidebar}
        setOpen={setAddressSidebar}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setAddressSidebar(false);
        }}
      />

      <SaveCards
        open={cardSidebar}
        setOpen={setCardSidebar}
        onSelect={(card) => {
          setSelectedCard(card);
          setCardSidebar(false);
        }}
      />


      <Footer />
    </>
  );
}
