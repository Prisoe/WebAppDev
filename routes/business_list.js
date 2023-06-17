const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/business_list", (req, res) => {
  // Render
  res.render("business_list");
});

// Export the router
module.exports = router;
