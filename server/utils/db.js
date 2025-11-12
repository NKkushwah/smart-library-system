const mongoose = require("mongoose");
require('dotenv').config(); 

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected successfully to database");
  } catch (error) {
    console.error("Database connection failed:", error.message); 
    process.exit(1);
  }
};

module.exports = connectDb;
