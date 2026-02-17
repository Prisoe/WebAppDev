const express = require("express");
const router = express.Router();
const Project = require("../../models/projects");

// Public: only published projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ isPublished: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    res.json({ projects });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

module.exports = router;
