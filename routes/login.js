/*
 * File: about.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/login", (req, res) => {
  // Render
  res.render("login");
});

// Export the router
module.exports = router;
