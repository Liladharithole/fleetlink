import mongoose from "mongoose";

export default async (uri) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
      dbName: "fleetlink",
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      retryWrites: true,
      w: "majority",
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Re-throw to be caught by the app.js
  }
};
