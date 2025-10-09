// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// ========================================
// ✅ Load Environment Variables
// ========================================
dotenv.config();

// ✅ Connect MongoDB
await connectDB();

const app = express();

// ========================================
// ✅ CORS CONFIGURATION (Render + Netlify)
// ========================================

const allowedOrigins = [
  "https://aquariumshop.netlify.app", // Frontend (Netlify)
  "https://aquariumshop.onrender.com", // Optional: allow self (Render API)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, same-origin)
      if (!origin) return callback(null, true);

      // Check allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Otherwise reject
      console.warn("🚫 Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================================
// ✅ Middleware
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// ✅ Path Setup
// ========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static assets (images, uploads)
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Optional direct access route for files
app.get("/assets/:filename", (req, res) => {
  const filePath = path.join(__dirname, "public/assets", req.params.filename);
  res.sendFile(filePath);
});

// ========================================
// ✅ API ROUTES
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ========================================
// ✅ Root Route
// ========================================
app.get("/", (req, res) => {
  res.send("🐠 Aquarium Shop Backend is running on Render!");
});

// ========================================
// ✅ 404 Handler
// ========================================
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ========================================
// ✅ Global Error Handler
// ========================================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack || err);
  res.status(500).json({
    message: "Server error",
    error: err.message || err,
  });
});

// ========================================
// ✅ Start Server
// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🌐 Allowed Origins:", allowedOrigins.join(", "));
});
