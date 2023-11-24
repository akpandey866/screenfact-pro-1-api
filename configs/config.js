// config.js
module.exports = {
    database: {
      url: 'mongodb://localhost:27017/screenfact',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    jwtSecret: 'your-secret-key-for-jwt',
    port: process.env.PORT || 3000,
  };
  