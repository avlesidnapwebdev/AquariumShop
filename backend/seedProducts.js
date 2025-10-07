import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import productsData from "./ProductListData.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const updatedProducts = [];

    for (const p of productsData) {
      // check if product exists by name
      const existing = await Product.findOne({ name: p.name });

      let saved;
      if (existing) {
        await Product.updateOne({ name: p.name }, { $set: p });
        saved = await Product.findOne({ name: p.name });
        console.log(`🔁 Updated: ${p.name}`);
      } else {
        saved = await Product.create(p);
        console.log(`🆕 Added: ${saved.name} (ID: ${saved._id})`);
      }

      // add the MongoDB-generated _id to local product data
      updatedProducts.push({
        ...p,
        _id: saved._id.toString(),
      });
    }

    // write updated products (with IDs) back to ProductListData.js
    const formatted = `const productsData = ${JSON.stringify(updatedProducts, null, 2)};\n\nexport default productsData;\n`;
    fs.writeFileSync("./ProductListData.js", formatted);

    console.log("✅ Product seeding complete and ProductListData.js updated with MongoDB IDs");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    mongoose.disconnect();
  }
};

seedProducts();
