/*
 * File: services.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Adding  routes for Services page

const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/services", (req, res) => {
  // Render
  res.render("services");
});

// Export the router
module.exports = router;
