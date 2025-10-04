import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* Helpers */
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "30d" });

export const register = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;
    if (!fullName || !email || !mobile || !password) return res.status(400).json({ message: "Please provide all fields" });

    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ fullName, email, mobile, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, mobile: user.mobile, profilePic: user.profilePic, addresses: user.addresses, cards: user.cards }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    if (!emailOrMobile || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, mobile: user.mobile, profilePic: user.profilePic, addresses: user.addresses, cards: user.cards }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
