const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI is not defined in your .env file. Running backend without database integration.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB Connected successfully!");
  } catch (error) {
    console.error("🔴 MongoDB connection failed:", error.message);
    console.log("💡 Tip: Make sure your local MongoDB instance is running (e.g. systemctl start mongod), or provide a MongoDB Atlas URI in your .env file.");
  }
};

module.exports = connectDB;