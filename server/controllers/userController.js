import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Order from "../models/Order.js";
import fs from "fs";
import path from "path";

/* Get profile (protected) */
export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // middleware sets req.user (without password)
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* Update profile (supports multipart/form-data with profilePic) */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, mobile, email } = req.body;
    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (email) user.email = email;

    if (req.file) {
      // delete old file if exists
      if (user.profilePic && user.profilePic.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), user.profilePic);
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Profile updated", ...user.toObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* Add address */
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json({ message: "Address added", addresses: user.addresses });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

/* Update address */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const idx = user.addresses.findIndex(a => a._id.toString() === addressId);
    if (idx === -1) return res.status(404).json({ message: "Address not found" });
    user.addresses[idx] = { ...user.addresses[idx].toObject(), ...req.body };
    await user.save();
    res.json({ message: "Address updated", addresses: user.addresses });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

/* Remove address */
export const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
    await user.save();
    res.json({ message: "Address removed", addresses: user.addresses });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

/* Add card (expects providerToken + masked data) */
export const addCard = async (req, res) => {
  try {
    const { providerToken, brand, last4, expiryMonth, expiryYear, isDefault } = req.body;
    if (req.body.cardNumber || req.body.cvv) {
      return res.status(400).json({ message: "Do not send full card details to server" });
    }
    const user = await User.findById(req.user._id);
    if (isDefault) user.cards.forEach(c => c.isDefault = false);
    user.cards.push({ providerToken, brand, last4, expiryMonth, expiryYear, isDefault: !!isDefault });
    await user.save();
    res.json({ message: "Card added", cards: user.cards });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

/* Remove card */
export const removeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await User.findById(req.user._id);
    user.cards = user.cards.filter(c => c._id.toString() !== cardId);
    await user.save();
    res.json({ message: "Card removed", cards: user.cards });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

/* Delete user and cascade delete related data */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // delete profile pic file
    if (user.profilePic && user.profilePic.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), user.profilePic);
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }

    // delete related collections
    await Cart.deleteOne({ user: userId });
    await Wishlist.deleteOne({ user: userId });
    await Order.deleteMany({ user: userId });

    // remove user
    await user.deleteOne();

    res.json({ message: "User and related data removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
