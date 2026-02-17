require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/users");

(async function run() {
  try {
    const mongo_url = `mongodb+srv://Prisoe:${process.env.DB_PASSWORD}@website-users.wtcy2br.mongodb.net/?appName=website-users`;
    await mongoose.connect(mongo_url);

    const users = await User.find({}, { email: 1, username: 1, role: 1 }).lean();
    console.log("Users in DB:");
    users.forEach(u => console.log(`- ${u.email} | ${u.username} | role=${u.role || "missing"}`));

    process.exit(0);
  } catch (e) {
    console.error("list_users error:", e.message);
    process.exit(1);
  }
})();
