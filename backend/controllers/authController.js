import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ===========================
   🔐 Helper: Generate JWT Token
=========================== */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET in environment variables!");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

/* ===========================
   🧾 REGISTER CONTROLLER
=========================== */
export const register = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Check if user already exists
    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ fullName, email, mobile, password });

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profilePic: user.profilePic,
        addresses: user.addresses,
        cards: user.cards,
      },
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   🔑 LOGIN CONTROLLER
=========================== */
export const login = async (req, res) => {
  try {
    // Support: { emailOrMobile, password } OR { email, password } OR { mobile, password }
    const identifier =
      req.body.emailOrMobile || req.body.email || req.body.mobile;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate new token
    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profilePic: user.profilePic,
        addresses: user.addresses,
        cards: user.cards,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
