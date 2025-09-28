import Product from "../models/Product.js";

// Create product (admin usage - for demo we keep simple)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const p = await Product.create({ name, description, price, image, category, stock });
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
