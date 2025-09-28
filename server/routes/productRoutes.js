import express from "express";
import {
  createProduct, listProducts, getProduct, updateProduct, deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", listProducts);
router.get("/:id", getProduct);

// For demo admin operations (protect in real app + role check)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
