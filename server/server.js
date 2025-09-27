import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",   // sometimes Vite uses this
  "http://localhost:3000",
  "https://aquariumshop.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps / curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // 👈 add this
    credentials: false, // keep false since you’re not using cookies
  })
);



app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
