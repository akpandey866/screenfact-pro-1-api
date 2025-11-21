// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../configs/config");
const User = require("../models/User");
const mongoose = require("mongoose");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, user_role_id, record_fee, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Generate a salt and hash the password
    const saltRounds = 10; // You can adjust this value based on your security requirements
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userObj = {
      username,
      email,
      password: hashedPassword,
      user_role_id,
    };

    if (req.body.user_role_id == 2) {
      userObj.company_name = req.body?.company_name || "";
      userObj.company_address = req.body?.company_address || "";
      userObj.gst_number = req.body?.gst_number || "";
      userObj.username = req.body?.username || "";
      userObj.record_fee = record_fee;
    }

    if (req.body.user_role_id == 3) {
      userObj.wallet_amount = 0;
      userObj.company_id = req.body?.company_id || 0;
      userObj.username = req.body?.username || "";
    }
    const newUser = new User(userObj);
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User has been register successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const tokenPayload = {
      userId: user._id,
      username: user.username,
      record_fee: user.record_fee,
      user_role_id: user.user_role_id,
      company_name: user.company_name,
      email: user.useremail,
      wallet_amount: user.wallet_amount,
    };

    // Check and include gst_number if it's defined
    // if (gst_number !== undefined) {
    //   tokenPayload.gst_number = gst_number;
    // } else {
    //   tokenPayload.gst_number = 0;
    // }

    const token = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout a user (JWT tokens are stateless, so "logging out" is typically handled on the client side)
exports.logout = (req, res) => {
  // Since JWT tokens are stateless, there's no server-side logout.
  // The client should discard the token or implement its own mechanism to handle "logout."
  res.json({ message: "Logout successful" });
};
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.authData = {
      userId: decoded.userId,
      username: decoded.username,
    };
    next();
  });
};

exports.getLogginDetail = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.authData.userId);
    const result = await User.findOne({ _id: userId }).exec();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.authData.userId);
    const updateOperation = {
      $set: {
        company_name: req.body.company_name,
        company_address: req.body.company_address,
        gst_number: req.body.gst_number,
        record_fee: req.body.record_fee,
      },
    };

    const result = await User.updateOne({ _id: userId }, updateOperation);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRecordPrice = async (req, res) => {
  try {
    const companyName = req.params.id;
    const recordId = new mongoose.Types.ObjectId(companyName);
    const result = await User.findOne({ _id: recordId }).exec();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const searchedUser = await User.find({
      user_role_id: 3,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }], // Include records without isDeleted or with isDeleted: false
    })
      .sort({ _id: -1 })
      .populate({ path: "company_id", select: "company_name" });

    const searchedCompany = await User.find({
      user_role_id: 2,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    }).sort({ _id: -1 });

    const searchedScreenfactUsers = await User.find({
      user_role_id: 4,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    }).sort({ _id: -1 });

    res.status(201).json({
      success: true,
      searchedUser: searchedUser,
      searchedCompany: searchedCompany,
      searchedScreenfactUsers: searchedScreenfactUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Update the isDeleted field to true
    const result = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor soft deleted successfully",
    });
  } catch (error) {
    console.error("Error soft deleting Vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.impersonateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find the user to impersonate
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a payload similar to the login function
    const tokenPayload = {
      userId: user._id,
      username: user.username,
      record_fee: user.record_fee,
      user_role_id: user.user_role_id,
      company_name: user.company_name,
      email: user.email,
      wallet_amount: user.wallet_amount,
    };

    // Generate a new token for the selected user
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Impersonation successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password, confirm_password, userId } = req.body;

    // Validate input
    if (!password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const recordId = new mongoose.Types.ObjectId(userId);
    const result = await User.findOne({ _id: recordId }).exec();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
