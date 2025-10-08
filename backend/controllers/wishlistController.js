import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// ✅ Helper - find or create wishlist for a user
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate("products");
  }
  return wishlist;
};

// ✅ GET /wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    res.json(wishlist);
  } catch (err) {
    console.error("getWishlist ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ POST /wishlist/add
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const wishlist = await getOrCreateWishlist(req.user._id);
    const alreadyInList = wishlist.products.some(
      (p) => p._id.toString() === productId
    );
    if (alreadyInList)
      return res.status(400).json({ message: "Already in wishlist" });

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate("products");

    res.json(wishlist);
  } catch (err) {
    console.error("addToWishlist ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ DELETE /wishlist/remove/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user._id);

    wishlist.products = wishlist.products.filter(
      (p) => p._id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.json(wishlist);
  } catch (err) {
    console.error("removeFromWishlist ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/wishlist/clear
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    wishlist.products = [];
    await wishlist.save();
    await wishlist.populate("products");
    res.json({ success: true, message: "Wishlist cleared", wishlist });
  } catch (err) {
    console.error("clearWishlist ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};