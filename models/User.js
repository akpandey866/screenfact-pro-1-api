// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    user_role_id: { type: Number, required: false }, //1=>superadmin,2=>company(collaborator-1)(who upload the record),3=>collaborator-2(who buys the product),4=>Screenfact internal users
    // Company registration details collaborator-1
    company_name: { type: String, required: false },
    company_address: { type: String, required: false },
    gst_number: { type: String, required: false },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // <-- Change from "Company" to "User"
      required: false,
    },
    // Collaborator-2 info
    record_fee: { type: Number, required: false },
    email: { type: String, required: false, unique: true },
    wallet_amount: { type: Number, required: false },
    payment_mode: { type: Number, required: false }, //1=>PayNow,2=>Wallet,3=>Free
    isDeleted: { type: Boolean, default: false }, // Add this field for soft delete
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
