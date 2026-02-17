const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },

    // nice-to-have metadata
    source: { type: String, default: "portfolio" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
