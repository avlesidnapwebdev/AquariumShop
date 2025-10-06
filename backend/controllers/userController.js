import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Order from "../models/Order.js";
import fs from "fs/promises";
import path from "path";

/* ===========================
   🧹 Helper to safely remove a file
   =========================== */
const removeFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore if not found
  }
};

/* ===========================
   ✅ Get Profile (with masked card numbers)
   =========================== */
export const getProfile = async (req, res) => {
  try {
    const { password, ...userData } = req.user.toObject();

    // Mask card numbers before sending
    if (userData.cards) {
      userData.cards = userData.cards.map((c) => ({
        ...c,
        cardNumber: "************" + c.last4,
      }));
    }

    res.json(userData);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Update Profile
   =========================== */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, mobile, email } = req.body;
    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (email) user.email = email;

    if (req.file) {
      if (user.profilePic && user.profilePic.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), user.profilePic);
        await removeFile(oldPath);
      }
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();
    const { password, ...userData } = user.toObject();
    res.json({ message: "Profile updated", ...userData });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Add Address
   =========================== */
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json({ message: "Address added", addresses: user.addresses });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Update Address
   =========================== */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const idx = user.addresses.findIndex(
      (a) => a._id.toString() === addressId
    );
    if (idx === -1)
      return res.status(404).json({ message: "Address not found" });

    user.addresses[idx] = { ...user.addresses[idx].toObject(), ...req.body };
    await user.save();
    res.json({ message: "Address updated", addresses: user.addresses });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Remove Address
   =========================== */
export const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== addressId
    );
    await user.save();
    res.json({ message: "Address removed", addresses: user.addresses });
  } catch (err) {
    console.error("Remove address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Add Card (masked storage only)
   =========================== */
export const addCard = async (req, res) => {
  try {
    const {
      providerToken,
      brand,
      cardNumber,
      expiryMonth,
      expiryYear,
      isDefault,
      cardType,
      name,
      cvv,
    } = req.body;

    if (!cardNumber || cardNumber.length !== 16) {
      return res.status(400).json({ message: "Invalid card number" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Make sure existing cards are preserved
    if (isDefault) user.cards.forEach((c) => (c.isDefault = false));

    // Store only last 4 + masked number (no real 16-digit)
    const maskedNumber = "************" + cardNumber.slice(-4);
    const maskedCVV = cvv ? cvv.replace(/\d/g, "*") : "***";

    const newCard = {
      providerToken,
      brand,
      cardNumber: maskedNumber, // masked
      last4: cardNumber.slice(-4),
      expiryMonth,
      expiryYear,
      cardType: cardType || "Debit",
      isDefault: !!isDefault,
      name: name || "Card Holder",
      cvv: maskedCVV,
    };

    user.cards.push(newCard);
    await user.save();

    const maskedCards = user.cards.map((c) => ({
      ...c.toObject(),
      cardNumber: "************" + c.last4,
    }));

    res.json({ message: "Card added", cards: maskedCards });
  } catch (err) {
    console.error("Add card error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Set Default Card
   =========================== */
export const setDefaultCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const card = user.cards.id(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    user.cards.forEach((c) => (c.isDefault = false));
    card.isDefault = true;

    await user.save();

    const maskedCards = user.cards.map((c) => ({
      ...c.toObject(),
      cardNumber: "************" + c.last4,
    }));

    res.json({ message: "Default card updated", cards: maskedCards });
  } catch (err) {
    console.error("Set default card error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Remove Card
   =========================== */
export const removeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await User.findById(req.user._id);
    user.cards = user.cards.filter((c) => c._id.toString() !== cardId);
    await user.save();

    const maskedCards = user.cards.map((c) => ({
      ...c.toObject(),
      cardNumber: "************" + c.last4,
    }));

    res.json({ message: "Card removed", cards: maskedCards });
  } catch (err) {
    console.error("Remove card error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ✅ Delete User (cascade)
   =========================== */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profilePic && user.profilePic.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), user.profilePic);
      await removeFile(filePath);
    }

    await Promise.all([
      Cart.deleteMany({ user: userId }),
      Wishlist.deleteMany({ user: userId }),
      Order.deleteMany({ user: userId }),
    ]);

    await user.deleteOne();
    res.json({ message: "User and related data removed" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
