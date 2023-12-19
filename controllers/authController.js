// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../configs/config");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      user_role_id,
      record_fee,
      email,
      mobile_number,
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Generate a salt and hash the password
    const saltRounds = 10; // You can adjust this value based on your security requirements
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userObj = {
      username,
      password: hashedPassword,
      user_role_id,
    };

    if (req.body.user_role_id == 2) {
      userObj.company_name = req.body?.company_name || "";
      userObj.company_address = req.body?.company_address || "";
      userObj.gst_number = req.body?.gst_number || "";
    }

    if (req.body.user_role_id == 3) {
      userObj.record_fee = record_fee;
      userObj.email = email || "";
      userObj.mobile_number = mobile_number || "";
      userObj.wallet_amount = 0;
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
    const { username, password } = req.body;
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        record_fee: user.record_fee,
        user_role_id: user.user_role_id,
        company_name: user.company_name,
      },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

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
