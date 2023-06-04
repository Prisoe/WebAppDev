/*
 * File: index.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Adding  routes for Home page

const express = require("express");
const router = express.Router();

// Define the route handlers
router.get("/", (req, res) => {
  // Render
  res.render("index");
});

router.get("/about", (req, res) => {
  // Render
  res.render("about");
});

router.get("/contact", (req, res) => {
  // Render
  res.render("contact");
});

router.get("/projects", (req, res) => {
  // Render
  res.render("projects");
});

router.get("/services", (req, res) => {
  // Render
  res.render("services");
});

// Export the router
module.exports = router;
