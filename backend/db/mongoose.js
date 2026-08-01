const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/hospital-management";
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.warn("⚠️ Database connection failed or MongoDB is not running locally. Continuing server launch:", error.message);
  }
};

module.exports = connectToDatabase;