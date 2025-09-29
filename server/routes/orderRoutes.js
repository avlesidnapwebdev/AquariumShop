import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { placeOrder, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);

export default router;
