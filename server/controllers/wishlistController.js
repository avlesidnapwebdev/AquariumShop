import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const getOrCreate = async (userId) => {
  let wl = await Wishlist.findOne({ user: userId }).populate("products");
  if (!wl) {
    wl = await Wishlist.create({ user: userId, products: [] });
    wl = await Wishlist.findById(wl._id).populate("products");
  }
  return wl;
};

export const getWishlist = async (req, res) => {
  try {
    const wl = await getOrCreate(req.user._id);
    res.json(wl);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const wl = await getOrCreate(req.user._id);
    if (wl.products.find(p => p._id.toString() === productId)) return res.status(400).json({ message: "Already in wishlist" });
    wl.products.push(productId);
    await wl.save();
    await wl.populate("products");
    res.json(wl);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wl = await getOrCreate(req.user._id);
    wl.products = wl.products.filter(p => p._id.toString() !== productId);
    await wl.save();
    await wl.populate("products");
    res.json(wl);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};
