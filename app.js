/*
 * File: app.js/server.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Starting Express

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const flash = require("express-flash");

var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var path = require("path");
const methodOverride = require("method-override");

app.use(flash());

//Passport Authentification
const passport = require("passport");
const session = require("express-session");

const initializePassport = require("./passport-config");
initializePassport(passport);

// MongoDB
const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://Prosper:Probol26@usersdb.qieknx7.mongodb.net/Users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Error connecting to the database:", error));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Method override for the logout function
app.use(methodOverride("_method"));

// Set view engine
app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Models
const user = require("./models/users");
const contact = require("./models/contact_list");

// mongo Db
app.use(express.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Set static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/javascript", express.static(__dirname + "public/javascript"));

// set up routes
const indexRouter = require("./routes/index");
const aboutRouter = require("./routes/about");
const projectsRouter = require("./routes/projects");
const servicesRouter = require("./routes/services");
const contactRouter = require("./routes/contact");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const business_listRouter = require("./routes/business_list");
const updateRouter = require("./routes/update");
const addClient = require("./routes/add_client");

//Set the path to the routes
app.use("/", indexRouter);
app.use("/about", aboutRouter);
app.use("/projects", projectsRouter);
app.use("/services", servicesRouter);
app.use("/contact", contactRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/business_list", business_listRouter);
app.use("/update", updateRouter);
app.use("/add_client", addClient);

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

app.post("/contact", (req, res) => {
  res.redirect("/");
});

app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/services", (req, res) => {
  res.render("services");
});

// Login
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/business_list",
    failureRedirect: "/login",
    failureFlash: true, // Enable flash messages for displaying error messages
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

// Register Clients
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const data = {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    };
    const collection = new user(data);
    await collection.save();

    res.render("login");
  } catch {
    res.redirect("register");
  }

  console.log("User registered");
});

// Business List
const Contact = require("./models/contact_list");

app.get("/business_list", checkAuthenticated, async (req, res) => {
  try {
    // Retrieve the list of contacts from the database
    const contacts = await Contact.find({});

    res.render("business_list", { contacts });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    // Handle the error and display an appropriate error message
  }
});

// Update View - GET request
app.get("/business_list/:id/update", checkAuthenticated, async (req, res) => {
  try {
    const contactId = req.params.id;

    // Retrieve the contact by its ID from the database
    const contact = await Contact.findById(contactId);

    res.render("update", { contact });
  } catch (err) {
    console.error("Error retrieving contact:", err);
    // Handle the error and display an appropriate error message
  }
});

// Update View - POST request
app.post("/business_list/:id/update", checkAuthenticated, async (req, res) => {
  try {
    const contactId = req.params.id;

    // Retrieve the updated contact details from the request body
    const { username, contactNumber, email } = req.body;

    // Update the contact in the database using its ID
    const updatedContact = await Contact.findByIdAndUpdate(contactId, {
      username,
      contactNumber,
      email,
    });

    // Redirect to the Business Contacts List View or display a success message
    res.redirect("/business_list");
  } catch (err) {
    console.error("Error updating contact:", err);
    // Handle the error and display an appropriate error message
  }
});

// Delete Contact - POST request
app.post("/business_list/:id/delete", checkAuthenticated, async (req, res) => {
  try {
    const contactId = req.params.id;

    // Delete the contact from the database using its ID
    await Contact.findByIdAndDelete(contactId);

    // Redirect to the Business Contacts List View or display a success message
    res.redirect("/business_list");
  } catch (err) {
    console.error("Error deleting contact:", err);
    // Handle the error and display an appropriate error message
  }
});

app.get("/add_client", checkAuthenticated, (req, res) => {
  res.render("add_client");
});

// Add Client - POST request
app.post("/add_client", checkAuthenticated, async (req, res) => {
  try {
    // Retrieve the client data from the request body
    const { username, email, contactNumber } = req.body;

    // Create a new client object using the data
    const newContact = new Contact({
      username,
      email,
      contactNumber,
    });

    // Save the new client to the database
    await newContact.save();

    // Redirect to a success page or display a success message
    res.redirect("/business_list");
  } catch (err) {
    console.error("Error adding client:", err);
    // Handle the error and display an appropriate error message
  }
});

// logout
app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle error if logout fails
      console.error(err);
      // Redirect to an error page or display an error message
      res.redirect("/error");
    } else {
      // Redirect to the login page after successful logout
      res.redirect("/login");
    }
  });
});

// Check for authentication
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("");
  }
  next();
}

// Port
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on ${port}`);
});
