import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  addCard,
  removeCard,
  setDefaultCard, // ✅ import the new controller
  deleteUser
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

// =======================
// PROFILE ROUTES
// =======================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePic"), updateProfile);

// =======================
// ADDRESS ROUTES
// =======================
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, removeAddress);

// =======================
// CARD ROUTES
// =======================
router.post("/cards", protect, addCard);
router.delete("/cards/:cardId", protect, removeCard);
router.put("/cards/default/:cardId", protect, setDefaultCard); // ✅ NEW: set default card

// =======================
// DELETE ACCOUNT
// =======================
router.delete("/", protect, deleteUser);

export default router;
