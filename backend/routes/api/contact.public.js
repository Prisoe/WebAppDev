const express = require("express");
const router = express.Router();
const ContactMessage = require("../../models/contact_message");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }

    const doc = await ContactMessage.create({
      name,
      email,
      message,
      source: "portfolio",
    });

    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

module.exports = router;
