const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    category: { type: String, default: "General", index: true },

    // Links
    githubUrl: { type: String, required: true },
    demoUrl: { type: String, default: "" },

    // Media
    imageUrl: { type: String, default: "" },

    // Ordering / visibility
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },

    // ✅ Add tags since frontend expects p.tags
    tags: [{ type: String, trim: true }],


    // Optional: more detailed list
    techStack: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
