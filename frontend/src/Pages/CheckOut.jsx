import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import { useCart } from "../Main/Constant/AddToCart.jsx";
import { useOrders } from "../Main/Constant/Order.jsx";
import SaveCards from "../Main/Constant/SaveCards.jsx";
import SaveAddress from "../Main/Constant/SaveAddress.jsx";
import {
  getProfileAPI,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/api.js";

export default function CheckOut() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();

  const stateItems = location.state?.cartItems || [];
  const stateTotal = location.state?.grandTotal || 0;

  const items = stateItems.length > 0 ? stateItems : cartItems;
  const subtotal =
    stateItems.length > 0
      ? stateTotal
      : cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [addressSidebar, setAddressSidebar] = useState(false);
  const [cardSidebar, setCardSidebar] = useState(false);

  // Scroll to top when page loads
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  // Fetch user profile (addresses + cards)
  const fetchProfile = async () => {
    try {
      const { data } = await getProfileAPI();
      setAddresses(data.addresses || []);
      setCards(data.cards || []);
    } catch (err) {
      console.error("Fetch profile failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =============================================================
     ✅ Razorpay Payment Flow
  ============================================================= */
  const handlePay = async () => {
    if (!selectedAddress) return alert("Please select a shipping address!");
    if (items.length === 0) return alert("Your cart is empty!");

    setLoading(true);

    try {
      // ✅ Step 1: Create Razorpay order from backend
      const { data } = await createRazorpayOrder({
        amount: subtotal,
        address: selectedAddress,
        items,
      });

      const { key, rOrder, ourOrderId } = data;

      // ✅ Step 2: Configure Razorpay Checkout
      const options = {
        key, // Razorpay key
        amount: rOrder.amount,
        currency: rOrder.currency,
        name: "AquaShop",
        description: "Product Purchase",
        order_id: rOrder.id,
        handler: async function (response) {
          try {
            // ✅ Step 3: Verify payment with backend
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ourOrderId,
            });

            // ✅ Add order locally
            const newOrders = items.map((item) => ({
              id: Date.now() + "-" + (item.id || item._id),
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

            // ✅ Clear cart and mark order placed
            clearCart();
            setOrderPlaced(true);
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: selectedAddress.name,
          email: selectedAddress.email || "",
          contact: selectedAddress.phone || "",
        },
        theme: { color: "#0ea5e9" },
      };

      // ✅ Step 4: Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert(err.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    setOrderPlaced(false);
    navigate("/shop");
  };

  /* =============================================================
     ✅ JSX UI
  ============================================================= */
  return (
    <>
      <Header />
      <div className="h-[95px] bg-white"></div>

      <div className="min-h-screen bg-gray-50 text-gray-800 flex justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Billing & Address */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow space-y-6">
            <h2 className="text-2xl font-semibold">Billing & Shipping</h2>

            {/* Address Selection */}
            <button
              onClick={() => setAddressSidebar(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Select Shipping Address
            </button>
            {selectedAddress && (
              <div className="p-4 border rounded-lg mt-2 bg-gray-50">
                <p className="font-semibold">{selectedAddress.name}</p>
                <p>
                  {selectedAddress.addressLine1}, {selectedAddress.addressLine2},{" "}
                  {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country} -{" "}
                  {selectedAddress.pincode}
                </p>
                <p>Phone: {selectedAddress.phone}</p>
              </div>
            )}

            {/* Card Selection */}
            <button
              onClick={() => setCardSidebar(true)}
              className="w-full bg-orange-500 text-white py-2 rounded-lg mt-4"
            >
              Select Payment Card (Optional)
            </button>
            {selectedCard && (
              <div className="p-4 border rounded-lg mt-2 bg-gray-50">
                <p className="font-semibold">{selectedCard.brand}</p>
                <p>**** **** **** {selectedCard.last4}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item._id || item.id} className="flex justify-between py-2">
                  <span>
                    {item.name || item.title} (x{item.qty})
                  </span>
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
              onClick={handlePay}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${subtotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

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
