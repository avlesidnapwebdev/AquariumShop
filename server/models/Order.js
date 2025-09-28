import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  priceAtPurchase: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }, // human-friendly id
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [orderProductSchema],
  totalAmount: Number,
  paymentMethod: { type: String, enum: ["Cash", "Card", "Razorpay"], default: "Cash" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  providerPaymentId: String, // e.g., razorpay_payment_id
  providerOrderId: String,   // e.g., razorpay_order_id
  address: Object,
  status: { type: String, enum: ["Received","Shipping","Out for Delivery","Delivered"], default: "Received" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
