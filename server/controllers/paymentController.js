import Order from "../models/Order.js";
import crypto from "crypto";

// Only import Razorpay if enabled
let razor;
if (process.env.RAZORPAY_ENABLED === "true") {
  const Razorpay = await import("razorpay").then(mod => mod.default);
  razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/* Create Razorpay order (frontend to use for checkout) */
export const createRazorpayOrder = async (req, res) => {
  if (process.env.RAZORPAY_ENABLED !== "true") {
    return res.status(503).json({ message: "Payment service is temporarily disabled" });
  }

  try {
    const { orderId } = req.body; // our order id
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const options = {
      amount: Math.round(order.totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: order.orderNumber,
    };

    const rOrder = await razor.orders.create(options);
    // Save providerOrderId
    order.providerOrderId = rOrder.id;
    await order.save();

    res.json({ rOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* Verify payment signature and update order status */
export const verifyRazorpayPayment = async (req, res) => {
  if (process.env.RAZORPAY_ENABLED !== "true") {
    return res.status(503).json({ message: "Payment service is temporarily disabled" });
  }

  try {
    // body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, ourOrderId }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ourOrderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !ourOrderId)
      return res.status(400).json({ message: "Missing fields" });

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findById(ourOrderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "Paid";
    order.providerPaymentId = razorpay_payment_id;
    order.paymentMethod = "Razorpay";
    await order.save();

    res.json({ message: "Payment verified", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
