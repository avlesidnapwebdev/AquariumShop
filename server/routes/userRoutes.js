import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile, updateProfile,
  addAddress, updateAddress, deleteAddress,
  addCard, removeCard
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// addresses
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

// cards
router.post("/cards", protect, addCard);
router.delete("/cards/:cardId", protect, removeCard);

export default router;
