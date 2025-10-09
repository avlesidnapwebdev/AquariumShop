// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();

// ================================
// ✅ CORS Configuration
// ================================
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev
  "http://localhost:3000",   // CRA dev
  "https://aquariumshop.netlify.app"      // Netlify frontend (set in Render environment)
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, mobile apps, same-origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
     callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
}));

// ================================
// ✅ Middleware
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// ✅ Paths setup
// ================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Optional direct file access
app.get("/assets/:filename", (req, res) => {
  const filePath = path.join(__dirname, "public/assets", req.params.filename);
  res.sendFile(filePath);
});

// ================================
// ✅ API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Root route
app.get("/", (req, res) => res.send("🐠 Aquarium Shop Backend is running"));

// ================================
// ✅ 404 Handler
// ================================
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ================================
// ✅ Global Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack || err);
  res.status(500).json({ message: "Server error", error: err.message || err });
});

// ================================
// ✅ Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
