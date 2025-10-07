import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

// ✅ Razorpay instance
const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ============================================================
   ✅ CREATE RAZORPAY ORDER (TEST MODE)
============================================================ */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, items, currency = "INR", address } = req.body;

    if (!amount || !items || !items.length || !address) {
      return res.status(400).json({ message: "Amount, items, and address are required" });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Razorpay order
    const razorpayOrder = await razor.orders.create({
      amount: amount * 100, // in paise
      currency,
      receipt: orderNumber,
    });

    // Map items
    const orderItems = items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.price
    }));

    // Save order in DB
    const order = new Order({
      orderNumber,
      user: req.user._id,
      products: orderItems,
      totalAmount: amount,
      address,                  // ✅ include address
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      providerOrderId: razorpayOrder.id
    });

    await order.save();

    res.status(200).json({
      success: true,
      rOrder: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
      ourOrderId: order._id
    });
  } catch (error) {
    console.error("💥 Razorpay Order Creation Error:", error);
    res.status(500).json({ message: "Payment initialization failed", error: error.message });
  }
};


/* ============================================================
   ✅ VERIFY RAZORPAY PAYMENT
============================================================ */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      ourOrderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !ourOrderId
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // 🔒 Verify signature
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

    res.status(200).json({ success: true, message: "Payment verified", order });
  } catch (err) {
    console.error("💥 Razorpay verify error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
