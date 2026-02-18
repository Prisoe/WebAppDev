/*
 * Backend/server.js
 */

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cors = require("cors");

const initializePassport = require("./passport-config");
initializePassport(passport);

// ------------------------
// Middleware
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// ✅ Trust proxy on Render (needed for secure cookies behind proxy)
app.set("trust proxy", 1);

// ------------------------
// CORS (ONLY for local dev)
// In production, frontend is served by the same domain => no CORS needed.
// ------------------------
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    })
  );
}

// ------------------------
// Session (required for passport)
// ------------------------
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
      secure: process.env.NODE_ENV === "production", // ✅ required for https cookies
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ------------------------
// API Routes
// ------------------------
app.use("/api/projects", require("./routes/api/projects.public"));
app.use("/api/contact", require("./routes/api/contact.public"));
app.use("/api/auth", require("./routes/api/auth"));

app.use("/api/admin/projects", require("./routes/api/admin.projects"));
app.use("/api/admin/messages", require("./routes/api/admin.messages"));
app.use("/api/admin/contacts", require("./routes/api/admin.contacts"));

// ------------------------
// ✅ Serve frontend build (production)
// ------------------------
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(distPath));

  // ✅ React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ------------------------
// Start server
// ------------------------
async function startServer() {
  try {
    if (!process.env.DB_PASSWORD) throw new Error("Missing DB_PASSWORD in env");
    if (!process.env.SESSION_KEY) throw new Error("Missing SESSION_KEY in env");

    const mongo_url = `mongodb+srv://Prisoe:${process.env.DB_PASSWORD}@website-users.wtcy2br.mongodb.net/?appName=website-users`;

    await mongoose.connect(mongo_url);
    console.log("Connected to the database");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();
