const Wallet = require("../models/Wallet");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.listing = async function (req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.authData.userId);
    // Fetch wallet amount
    const walletAmount = await User.findOne({ _id: userId }).select(
      "wallet_amount"
    );

    // Fetch wallet data
    const result = await Wallet.find({ user_id: userId }).exec();

    res.status(201).json({
      success: true,
      data: result,
      wallet_amount: walletAmount.wallet_amount, // assuming wallet_amount is a property of the walletAmount object
    });
  } catch (error) {
    console.error("Error in listing function:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.addMoney = async function (req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.authData.userId);
    const wallet = new Wallet({
      user_id: userId,
      payment_status: 1,
      amount: req.body.amount,
      type: 1,
    });

    await wallet.save();

    // Update the user's amount_wallet field
    await User.updateOne(
      { _id: userId },
      { $inc: { wallet_amount: req.body.amount } }
    );

    res.status(201).json({
      success: true,
      message: "Wallet money has been added into your account.",
    });
  } catch (error) {
    console.error("Error adding money to the wallet:", error);
    res.status(500).json({
      success: false,
      message: "Error adding money to the wallet.",
      error: error.message,
    });
  }
};
