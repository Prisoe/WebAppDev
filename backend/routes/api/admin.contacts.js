const express = require("express");
const router = express.Router();

const Contact = require("../../models/contact_list");
const { ensureAuthenticated, ensureAdmin } = require("../../middleware/auth");
router.use(ensureAuthenticated, ensureAdmin);


router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ contacts });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email, contactNumber } = req.body;
    if (!username || !email || !contactNumber) {
      return res.status(400).json({ error: "username, email, contactNumber required" });
    }

    const created = await Contact.create({ username, email, contactNumber });
    return res.status(201).json({ ok: true, contact: created });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create contact" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true, contact: updated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update contact" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = router;
