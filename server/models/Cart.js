import mongoose from "mongoose"; 

const cartProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  products: [cartProductSchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Cart", cartSchema);
