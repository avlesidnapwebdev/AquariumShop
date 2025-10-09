import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ===========================
   🔒 AUTH MIDDLEWARE (protect)
=========================== */
export const protect = async (req, res, next) => {
  let token;

  try {
    // 1️⃣ Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      if (!process.env.JWT_SECRET) {
        console.error("❌ Missing JWT_SECRET in environment variables!");
        return res
          .status(500)
          .json({ message: "Server configuration error: JWT secret missing" });
      }

      // 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3️⃣ Find user from decoded token ID
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // 4️⃣ Attach user to request
      req.user = user;

      // ✅ Continue to next middleware/route
      next();
    } else {
      // ❌ No token provided
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
