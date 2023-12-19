// models/User.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    company_name: { type: String, required: false },
    gst_number: { type: String, required: false },
    company_address: { type: String, required: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
