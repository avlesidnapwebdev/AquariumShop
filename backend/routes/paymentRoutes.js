import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/razorpay/create", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

export default router;
