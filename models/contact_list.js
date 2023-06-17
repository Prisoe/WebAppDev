const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  username: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  // Add any other relevant fields for the contact
});

const contact = mongoose.model("Contact", contactSchema);
module.exports = contact;
