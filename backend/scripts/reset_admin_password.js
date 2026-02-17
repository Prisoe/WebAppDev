require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/users");

async function run() {
  try {
    const { DB_PASSWORD, ADMIN_EMAIL, NEW_ADMIN_PASSWORD } = process.env;
    if (!DB_PASSWORD || !ADMIN_EMAIL || !NEW_ADMIN_PASSWORD) {
      throw new Error("Missing env vars");
    }

    const mongo_url = `mongodb+srv://Prisoe:${DB_PASSWORD}@website-users.wtcy2br.mongodb.net/?appName=website-users`;
    await mongoose.connect(mongo_url);

    const user = await User.findOne({ email: ADMIN_EMAIL });
    if (!user) throw new Error("Admin user not found");

    const hashed = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
    user.password = hashed;
    await user.save();

    console.log("✅ Admin password reset successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

run();
