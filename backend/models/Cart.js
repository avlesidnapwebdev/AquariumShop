import mongoose from "mongoose";

const CartItem = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  products: [CartItem]
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
