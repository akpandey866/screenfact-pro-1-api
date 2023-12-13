// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: { type: "ObjectId", ref: "User" },
    description: {
      type: String,
    },
    // Add other fields as needed
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
