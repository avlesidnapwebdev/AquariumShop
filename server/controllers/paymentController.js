import Order from "../models/Order.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // ensure env variables are loaded

let razor = null;
const RAZORPAY_ENABLED = process.env.RAZORPAY_ENABLED === "true";

if (RAZORPAY_ENABLED) {
  try {
    const RazorpayModule = await import("razorpay");
    const Razorpay = RazorpayModule.default;

    razor = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("Razorpay initialized ✅");
  } catch (err) {
    console.error("Failed to initialize Razorpay:", err);
  }
}

export const createRazorpayOrder = async (req, res) => {
  if (!RAZORPAY_ENABLED || !razor)
    return res.status(503).json({ message: "Payment service disabled" });

  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const options = {
      amount: Math.round(order.totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: order.orderNumber,
    };

    const rOrder = await razor.orders.create(options);
    order.providerOrderId = rOrder.id;
    await order.save();

    res.json({ rOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  if (!RAZORPAY_ENABLED || !razor)
    return res.status(503).json({ message: "Payment service disabled" });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ourOrderId } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !ourOrderId)
      return res.status(400).json({ message: "Missing fields" });

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid signature" });

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
