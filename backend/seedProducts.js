import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import productsData from "./ProductListData.js"; // your 243 products array

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    for (const p of productsData) {
      // Check if product already exists by "id" field
      const existing = await Product.findOne({ id: p.id });

      if (existing) {
        // Update existing product with new details
        await Product.updateOne({ id: p.id }, { $set: p });
        console.log(`Updated product: ${p.name} (ID: ${p.id})`);
      } else {
        // Insert new product
        await Product.create(p);
        console.log(`Added new product: ${p.name} (ID: ${p.id})`);
      }
    }

    console.log("✅ Products seeding complete");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seedProducts();
