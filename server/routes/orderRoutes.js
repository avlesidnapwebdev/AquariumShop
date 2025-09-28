import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { placeOrder, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);            // place order (creates order doc)
router.get("/", protect, getMyOrders);            // get all orders of user
router.get("/:id", protect, getOrderById);        // get specific order (user-only)
router.put("/:id/status", protect, updateOrderStatus); // update order status (for demo)

export default router;
