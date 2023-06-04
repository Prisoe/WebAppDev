/*
 * File: contact.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Adding  routes for contact page

const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/contact", (req, res) => {
  // Render
  res.render("contact");
});

// Export the router
module.exports = router;
