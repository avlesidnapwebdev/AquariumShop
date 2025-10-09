import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

dotenv.config();

// ✅ Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ============================================================
   ✅ CREATE RAZORPAY ORDER
============================================================ */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, address } = req.body;
    if (!amount || !address)
      return res
        .status(400)
        .json({ message: "Amount and address are required" });

    // Fetch user cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    // Build order items from cart
    const orderItems = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );

    // Unique order number
    const orderNumber = `AQ-${Date.now().toString(36)}-${Math.floor(
      Math.random() * 10000
    )}`;

    // Create Razorpay order (amount in paise)
    const rOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: orderNumber,
    });

    // Save order to DB (status: pending)
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      products: orderItems,
      totalAmount,
      address,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      providerOrderId: rOrder.id,
    });

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      rOrder,
      ourOrderId: order._id,
      totalAmount,
    });
  } catch (err) {
    console.error("💥 Razorpay Order Creation Error:", err);
    res
      .status(500)
      .json({ message: "Payment initialization failed", error: err.message });
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

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid signature" });

    // ✅ Mark order as paid
    const order = await Order.findById(ourOrderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "Paid";
    order.providerPaymentId = razorpay_payment_id;
    order.status = "Received";
    await order.save();

    // 🔹 Reduce product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 🔹 Clear user cart
    const cart = await Cart.findOne({ user: order.user });
    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully", order });
  } catch (err) {
    console.error("💥 Razorpay Payment Verify Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
