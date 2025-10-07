import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";

// Build order from cart
const buildOrderFromCart = async (cart) => {
  await cart.populate("products.product");
  const products = [];
  let total = 0;
  for (const item of cart.products) {
    const p = item.product;
    const qty = item.quantity;
    const priceAtPurchase = p.price;
    total += priceAtPurchase * qty;
    products.push({ product: p._id, quantity: qty, priceAtPurchase });
  }
  return { products, total };
};

// Place order
export const placeOrder = async (req, res) => {
  try {
    const { address, paymentMethod = "Cash" } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.products.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const { products, total } = await buildOrderFromCart(cart);

    const orderNumber = `AQ-${Date.now().toString(36)}-${Math.floor(Math.random()*10000)}-${uuidv4().slice(0,6)}`;
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      products,
      totalAmount: total,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Pending",
    });

    // reduce stock
    for (const it of products) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
    }

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("placeOrder ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("getMyOrders ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("getOrderById ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("updateOrderStatus ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
