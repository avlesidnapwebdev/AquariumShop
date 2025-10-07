import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Helper: get or create cart for a user
const getOrCreate = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("products.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] });
    cart = await Cart.findById(cart._id).populate("products.product");
  }
  return cart;
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
    const cart = await getOrCreate(req.user._id);
    res.json(cart);
  } catch (err) {
    console.error("getCart ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreate(userId);

    // Clean invalid items
    cart.products = cart.products.filter(p => p.product != null);

    // Check if product already exists in cart
    const idx = cart.products.findIndex(p => p.product._id.toString() === productId.toString());

    if (idx > -1) cart.products[idx].quantity += Number(quantity);
    else cart.products.push({ product: productId, quantity: Number(quantity) });

    await cart.save();
    await cart.populate("products.product");

    res.json(cart);
  } catch (err) {
    console.error("addToCart ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/cart/item/:productId
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId) return res.status(400).json({ message: "productId is required" });

    const cart = await getOrCreate(userId);
    cart.products = cart.products.filter(p => p.product != null);

    const idx = cart.products.findIndex(p => p.product._id.toString() === productId.toString());
    if (idx === -1) return res.status(404).json({ message: "Product not in cart" });

    if (quantity <= 0) cart.products.splice(idx, 1);
    else cart.products[idx].quantity = Number(quantity);

    await cart.save();
    await cart.populate("products.product");

    res.json(cart);
  } catch (err) {
    console.error("updateCartItem ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/cart/clear
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cart = await getOrCreate(userId);
    cart.products = [];
    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
