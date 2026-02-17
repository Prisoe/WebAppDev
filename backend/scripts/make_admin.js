require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/users");

async function run() {
  try {
    if (!process.env.DB_PASSWORD) throw new Error("Missing DB_PASSWORD");

    const mongo_url = `mongodb+srv://Prisoe:${process.env.DB_PASSWORD}@website-users.wtcy2br.mongodb.net/?appName=website-users`;
    await mongoose.connect(mongo_url);

    // 👇 use the email EXACTLY as stored in DB
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error("Missing ADMIN_EMAIL in .env");

    const user = await User.findOne({ email: adminEmail });
    if (!user) throw new Error(`No user found with email: ${adminEmail}`);

    user.role = "admin";
    await user.save();
    console.log(`✅ ${adminEmail} promoted to ADMIN`);
    process.exit(0);
  } catch (err) {
    console.error("make_admin error:", err.message);
    process.exit(1);
  }
}
