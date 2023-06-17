const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/add_client", (req, res) => {
  // Render
  res.render("add_client");
});

// Export the router
module.exports = router;
