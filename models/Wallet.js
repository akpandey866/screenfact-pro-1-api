const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    payment_response: String,
    payment_status: { type: Number, required: false },
    type: { type: Number, required: false },
    amount: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
