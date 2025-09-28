import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { v4 as uuidv4 } from 'uuid';

/* Helper to compute cart total and build order products */
const buildOrderFromCart = async (cart) => {
  let total = 0;
  const products = [];
  await cart.populate("products.product");
  for (const item of cart.products) {
    const p = item.product;
    const qty = item.quantity;
    const priceAtPurchase = p.price;
    total += priceAtPurchase * qty;
    products.push({ product: p._id, quantity: qty, priceAtPurchase });
  }
  return { products, total };
};

export const placeOrder = async (req, res) => {
  try {
    // body: { addressId (or address object), paymentMethod, cardId (optional) }
    const { addressId, paymentMethod = "Cash", address: addressObj } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.products.length === 0) return res.status(400).json({ message: "Cart is empty" });

    // Compose address
    let address = {};
    if (addressObj) address = addressObj;
    else if (addressId) {
      const user = req.user;
      const addr = user.addresses.find(a => a._id.toString() === addressId);
      if (!addr) return res.status(400).json({ message: "Address not found" });
      address = addr;
    } else {
      return res.status(400).json({ message: "Address required" });
    }

    const { products, total } = await buildOrderFromCart(cart);

    const orderNumber = `AQ-${Date.now().toString(36)}-${Math.floor(Math.random()*10000)}`;
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      products,
      totalAmount: total,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Pending"
    });

    // reduce stock (simple)
    for (const it of products) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
    }

    // Clear cart after placing order
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin or fulfillment updates order status (for demo we allow the user to update if needed)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // must be one of allowed statuses
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
