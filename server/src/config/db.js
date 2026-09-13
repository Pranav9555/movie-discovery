// MongoDB connection using Mongoose.

const mongoose = require("mongoose");
const { env } = require("./env");

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("[db] Connected to MongoDB");
  } catch (error) {
    console.error("[db] Failed to connect to MongoDB:", error.message);
    // Without a database the wishlist cannot work, so stop the process.
    process.exit(1);
  }
};

// Used by the /api/health endpoint.
// mongoose.connection.readyState: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
const getDatabaseStatus = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

module.exports = { connectDatabase, getDatabaseStatus };
