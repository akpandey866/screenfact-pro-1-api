// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // You can add more fields as needed, for example:
  // email: { type: String, required: true, unique: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
