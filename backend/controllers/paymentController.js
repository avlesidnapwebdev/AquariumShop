import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

dotenv.config();

// ✅ Razorpay instance
const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ============================================================
   ✅ CREATE RAZORPAY ORDER
============================================================ */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, amount, currency = "INR", address } = req.body;

    if (!amount || !items?.length || !address) {
      return res.status(400).json({ message: "Amount, items, and address are required" });
    }

    // Generate unique order number
    const orderNumber = `AQ-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`;

    // Create Razorpay order
    const rOrder = await razor.orders.create({
      amount: amount * 100, // amount in paise
      currency,
      receipt: orderNumber,
    });

    // Map items to Order schema
    const orderItems = items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    }));

    // Save order in DB
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      products: orderItems,
      totalAmount: amount,
      address,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      providerOrderId: rOrder.id,
    });

    res.status(200).json({
      success: true,
      rOrder,
      key: process.env.RAZORPAY_KEY_ID,
      ourOrderId: order._id,
    });
  } catch (err) {
    console.error("💥 Razorpay Order Creation Error:", err);
    res.status(500).json({ message: "Payment initialization failed", error: err.message });
  }
};

/* ============================================================
   ✅ VERIFY RAZORPAY PAYMENT
============================================================ */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ourOrderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !ourOrderId) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ Update order as Paid
    const order = await Order.findById(ourOrderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "Paid";
    order.providerPaymentId = razorpay_payment_id;
    order.status = "Received";
    await order.save();

    // 🔹 Reduce stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // 🔹 Clear user's cart
    const cart = await Cart.findOne({ user: order.user });
    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res.status(200).json({ success: true, message: "Payment verified", order });
  } catch (err) {
    console.error("💥 Razorpay verify error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
