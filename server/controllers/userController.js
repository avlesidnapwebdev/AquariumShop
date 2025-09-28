import User from "../models/User.js";

// Get current user profile (req.user is set by protect)
export const getProfile = async (req, res) => {
  res.json(req.user); // already excludes password in middleware
};

// Update profile fields: name, email (if allowed) or password
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // pre-save hook will hash

    await user.save();
    res.json({ message: "Profile updated", user: { id: user._id, name: user.name, email: user.email, addresses: user.addresses, cards: user.cards } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* Address management */
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json({ message: "Address added", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const idx = user.addresses.findIndex(a => a._id.toString() === addressId);
    if (idx === -1) return res.status(404).json({ message: "Address not found" });
    user.addresses[idx] = { ...user.addresses[idx].toObject(), ...req.body };
    await user.save();
    res.json({ message: "Address updated", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
    await user.save();
    res.json({ message: "Address removed", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* Card management
   - We expect a token from front-end (Razorpay token) if card should be saved for reuse.
   - We will only store masked data and providerToken (not CVV / raw number).
*/
export const addCard = async (req, res) => {
  try {
    const { providerToken, brand, last4, expiryMonth, expiryYear, isDefault } = req.body;

    // Defensive: do not accept full PAN or CVV
    if (req.body.cardNumber || req.body.cvv) {
      return res.status(400).json({ message: "Do not send full card number or CVV. Use provider tokenization." });
    }

    const user = await User.findById(req.user._id);
    user.cards.push({ providerToken, brand, last4, expiryMonth, expiryYear, isDefault: !!isDefault });
    if (isDefault) {
      // unset others
      user.cards = user.cards.map((c, idx, arr) => ({ ...c.toObject(), isDefault: c.isDefault }));
      // (we pushed with isDefault true already)
    }
    await user.save();
    res.json({ message: "Card saved (masked)", cards: user.cards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await User.findById(req.user._id);
    user.cards = user.cards.filter(c => c._id.toString() !== cardId);
    await user.save();
    res.json({ message: "Card removed", cards: user.cards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
