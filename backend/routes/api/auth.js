const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../../models/users");

const router = express.Router();

// REGISTER (always creates "user")
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, password required" });
    }

    // ✅ block duplicates
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // 🔒 FORCE role here. Ignore anything from the client.
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: "user",
    });

    return res.status(201).json({
      ok: true,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN (passport local)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || "Invalid credentials" });

    req.logIn(user, (err2) => {
      if (err2) return next(err2);
      return res.json({
        ok: true,
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
      });
    });
  })(req, res, next);
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });
});

// CURRENT USER
router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({
    user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role },
  });
});

module.exports = router;
