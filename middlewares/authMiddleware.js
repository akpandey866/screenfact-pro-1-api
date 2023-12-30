// authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../configs/config");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      if (
        err.name === "JsonWebTokenError" &&
        err.message === "invalid signature"
      ) {
        console.error("JWT verification error: Invalid signature");
        return res
          .status(401)
          .json({ error: "Unauthorized: Invalid token signature" });
      }

      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.authData = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      company_name: decoded.company_name,
    };

    next();
  });
};
