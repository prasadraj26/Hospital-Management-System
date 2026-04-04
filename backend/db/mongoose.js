const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    // Use direct connection string for now
    const DB_URI = "mongodb://localhost:27017/hospital-management";
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ Error connecting to the database:", error.message);
    throw error;
  }
};

module.exports = connectToDatabase;