import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    address: { type: Object, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Card", "Razorpay"], default: "Cash" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    providerOrderId: String,
    providerPaymentId: String,
    status: { type: String, enum: ["Received", "Shipping", "Out for Delivery", "Delivered"], default: "Received" },
  },
  { timestamps: true }
);

OrderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    const uniquePart = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ORD-${Date.now()}-${uniquePart}`;
  }
  next();
});

export default mongoose.model("Order", OrderSchema);
