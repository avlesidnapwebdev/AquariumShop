import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import { Trash2 } from "lucide-react";
import ProductRecent from "../Components/Product/ProductRecentViews.jsx";
import { updateCartItem, getCart, clearCart } from "../api/api.js";

export default function OrderPage() {
  const location = useLocation();
  const initialItems = location.state?.cartItems || [];

  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch latest cart from DB (sync)
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      const cartItems = res.data?.products?.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        qty: item.quantity,
      })) || [];
      setItems(cartItems);
    } catch (err) {
      console.error("Fetch cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ Update quantity and sync to DB
  const updateQty = async (id, qty) => {
    if (qty < 1) {
      await removeItem(id);
      return;
    }
    try {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item))
      );
      await updateCartItem(id, { quantity: qty });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // ✅ Remove item (set qty = 0)
  const removeItem = async (id) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== id));
      await updateCartItem(id, { quantity: 0 }); // backend auto-remove if qty=0
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (loading) {
    return (
      <>
        <Header />
        <div className="h-[100px]"></div>
        <div className="p-6 text-center text-blue-500 font-semibold">
          Loading your order...
        </div>
        <Footer />
      </>
    );
  }

  if (!items || items.length === 0) {
    return (
      <>
        <Header />
        <div className="h-[100px]"></div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold">No orders found</h2>
          <Link
            to="/shop"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="h-[100px]"></div>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
          {items.map((item) => {
            const productName =
              item.name || item.title || item.productName || "Unnamed Product";

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-md bg-white text-blue-500"
              >
                {/* Product details */}
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-lg text-blue-500">
                      {productName}
                    </p>
                    <p className="text-gray-500">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity + Actions */}
                <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center border rounded"
                  />
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center text-red-600 hover:underline"
                  >
                    <Trash2 size={16} className="mr-1" /> Remove
                  </button>
                </div>

                {/* Subtotal */}
                <div className="mt-3 sm:mt-0 sm:ml-6 text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-bold text-lg">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Cart Totals */}
        <div className="border p-4 rounded-md bg-white h-fit text-blue-500">
          <h2 className="text-xl font-bold mb-4">Cart Totals</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-red-600">₹{subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            state={{ cartItems: items, grandTotal: subtotal }}
          >
            <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="max-w-6xl mx-auto mt-10">
        <ProductRecent
          recent={[
            {
              id: 1001,
              name: "Adolfo's Cory",
              image: "/assets/fish/fish/Adolfo s cory.png",
            },
            {
              id: 1002,
              name: "Adonis Tetra",
              image: "/assets/fish/fish/Adonis tetra.png",
            },
            {
              id: 1003,
              name: "African Peacock Cichlid",
              image: "/assets/fish/fish/African peacock cichlid.png",
            },
          ]}
        />
      </div>

      <Footer />
    </>
  );
}
