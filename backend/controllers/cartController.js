import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getOrCreate = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("products.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] });
    cart = await Cart.findById(cart._id).populate("products.product");
  }
  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreate(req.user._id);
    res.json(cart);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreate(req.user._id);
    const idx = cart.products.findIndex(p => p.product._id.toString() === productId);
    if (idx > -1) cart.products[idx].quantity += Number(quantity);
    else cart.products.push({ product: productId, quantity: Number(quantity) });
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await getOrCreate(req.user._id);
    const idx = cart.products.findIndex(p => p.product._id.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: "Not in cart" });
    if (quantity <= 0) cart.products.splice(idx, 1);
    else cart.products[idx].quantity = Number(quantity);
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreate(req.user._id);
    cart.products = [];
    await cart.save();
    res.json({ message: "Cleared" });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};
