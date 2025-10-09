import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ===========================
   ✅ Address Schema
=========================== */
const AddressSchema = new mongoose.Schema({
  label: String,
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
});

/* ===========================
   ✅ Card Schema
=========================== */
const CardSchema = new mongoose.Schema({
  providerToken: { type: String, required: true },
  brand: { type: String, required: true },
  cardNumber: { type: String, required: true },
  last4: { type: String, required: true },
  expiryMonth: { type: Number, required: true },
  expiryYear: { type: Number, required: true },
  cardType: {
    type: String,
    enum: ["Credit", "Debit", "Prepaid", "UPI", "Other"],
    default: "Credit",
  },
  cvv: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  name: { type: String, required: true, default: "Card Holder" },
  createdAt: { type: Date, default: Date.now },
});

/* ===========================
   ✅ User Schema
=========================== */
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
    addresses: [AddressSchema],
    cards: [CardSchema],
  },
  { timestamps: true }
);

/* ===========================
   ✅ Password Hash Middleware
=========================== */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ===========================
   ✅ Compare Password Method
=========================== */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
