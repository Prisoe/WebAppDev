/*
 * File: app.js/server.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Starting Express
const express = require("express");
const app = express();

var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var path = require("path");

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set static files
app.use(express.static(path.join("public")));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/javascript", express.static(__dirname + "public/javascript"));

// set up routes
const indexRouter = require("./routes/index");
const aboutRouter = require("./routes/about");
const projectsRouter = require("./routes/projects");
const servicesRouter = require("./routes/services");
const contactRouter = require("./routes/contact");

//Set the path to the routes
app.use("/", indexRouter);
app.use("/about", aboutRouter);
app.use("/projects", projectsRouter);
app.use("/services", servicesRouter);
app.use("/contact", contactRouter);

// render files
app.get("", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (res, req) => {
  res.redirect("/");
});

app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/services", (req, res) => {
  res.render("services");
});

// Port
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on ${port}`);
});
