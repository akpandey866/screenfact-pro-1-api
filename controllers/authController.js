// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../configs/config");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Generate a salt and hash the password
    const saltRounds = 10; // You can adjust this value based on your security requirements
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
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
      { userId: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn: "24h" }
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
