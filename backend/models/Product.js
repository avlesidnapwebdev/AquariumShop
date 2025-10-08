import mongoose from "mongoose";

// Sub-schema for product reviews
const ReviewSchema = new mongoose.Schema({
  rating: { type: Number, default: 0 },
  text: String,
}, { _id: false });

// Main Product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String, // Relative path to public/assets, e.g., /assets/fish/fishbg/coral.jpg
    category: String,
    stock: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    tags: [String],
    additionalInfo: [String],
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
