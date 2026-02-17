const express = require("express");
const router = express.Router();

const Project = require("../../models/projects");
const { ensureAuthenticated, ensureAdmin } = require("../../middleware/auth");
router.use(ensureAuthenticated, ensureAdmin);


router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Project.create(req.body);
    res.status(201).json({ ok: true, project: created });
  } catch (err) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, project: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
