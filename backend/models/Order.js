import mongoose from "mongoose";

// 🧩 Sub-schema for individual items in an order
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
  },
});

// 🧠 Main Order Schema
const OrderSchema = new mongoose.Schema(
  {
    // unique order number for tracking
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // user placing the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // list of purchased products
    products: [OrderItemSchema],

    // total order amount
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // shipping address details
    address: {
      type: Object,
      required: true,
    },

    // payment method
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Razorpay"],
      default: "Cash",
    },

    // payment status
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // Razorpay or other provider details
    providerOrderId: String,
    providerPaymentId: String,

    // delivery status
    status: {
      type: String,
      enum: ["Received", "Shipping", "Out for Delivery", "Delivered"],
      default: "Received",
    },
  },
  { timestamps: true }
);

// ⚙️ Auto-generate unique orderNumber before validation
OrderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    const uniquePart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    this.orderNumber = `ORD-${Date.now()}-${uniquePart}`;
  }
  next();
});

export default mongoose.model("Order", OrderSchema);
