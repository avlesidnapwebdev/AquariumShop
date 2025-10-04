import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile, updateProfile, addAddress, updateAddress, removeAddress,
  addCard, removeCard, deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// multer setup for profile pictures
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePic"), updateProfile);

// addresses
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, removeAddress);

// cards
router.post("/cards", protect, addCard);
router.delete("/cards/:cardId", protect, removeCard);

// delete account (cascade)
router.delete("/", protect, deleteUser);

export default router;
