const express = require("express");
const router = express.Router();

const ContactMessage = require("../../models/contact_message");
const { ensureAuthenticated, ensureAdmin } = require("../../middleware/auth");
router.use(ensureAuthenticated, ensureAdmin);


router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, message: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

module.exports = router;
