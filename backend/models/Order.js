import mongoose from "mongoose";

const OrderItem = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  priceAtPurchase: Number
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [OrderItem],
  totalAmount: Number,
  address: Object,
  paymentMethod: { type: String, enum: ["Cash", "Card", "Razorpay"], default: "Cash" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  providerOrderId: String,
  providerPaymentId: String,
  status: { type: String, enum: ["Received", "Shipping", "Out for Delivery", "Delivered"], default: "Received" }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
