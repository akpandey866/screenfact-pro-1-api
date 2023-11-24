// db.js
const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.database.url, config.database.options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

module.exports = mongoose;
