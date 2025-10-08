import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all products (A → Z by name) with full image URLs
export const listProducts = async (req, res) => {
  try {
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const products = await Product.find().sort({ createdAt: 1 }); // ascending order

    // Convert relative image paths to full URLs
    const withFullURLs = products.map((p) => ({
      ...p.toObject(),
      image: p.image?.startsWith("http") ? p.image : `${baseURL}${p.image}`,
    }));

    res.json(withFullURLs);
  } catch (err) {
    console.error("listProducts ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product by ID with full image URL
export const getProduct = async (req, res) => {
  try {
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const withFullURL = {
      ...product.toObject(),
      image: product.image?.startsWith("http")
        ? product.image
        : `${baseURL}${product.image}`,
    };

    res.json(withFullURL);
  } catch (err) {
    console.error("getProduct ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("updateProduct ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("deleteProduct ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
