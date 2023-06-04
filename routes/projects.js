/*
 * File: projects.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Adding  routes for Projects page


const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/projects", (req, res) => {
  // Render
  res.render("projects");
});

// Export the router
module.exports = router;
