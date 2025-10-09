import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// 🔹 Create Razorpay order
router.post("/razorpay/create", protect, createRazorpayOrder);

// 🔹 Verify Razorpay payment
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

export default router;
