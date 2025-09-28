import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  label: { type: String }, // e.g., "Home", "Office"
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" }
});

const cardSchema = new mongoose.Schema({
  providerToken: { type: String }, // token from Razorpay or other provider
  brand: String, // Visa/Mastercard
  last4: String,
  expiryMonth: Number,
  expiryYear: Number,
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [addressSchema],
  cards: [cardSchema],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
