// config.js
module.exports = {
  database: {
    url: process.env.MONGO_URI || "mongodb://localhost:27017/screenfact",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwtSecret: "N7$^rL#s9qEaFp2yGhZbT!uKjXv3@Wk",
  port: process.env.PORT || 5000,
};
