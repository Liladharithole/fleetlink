import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Connection events
mongoose.connection.on("connecting", () => {
  console.log("🔄 Connecting to MongoDB...");
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("ℹ️  MongoDB disconnected");
});

// Close connection on application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

const connectWithRetry = async (uri, retries = 0) => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri, {
      dbName: "fleetlink",
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
    });

    console.log(`✅ MongoDB connected to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(
      `❌ MongoDB connection error (attempt ${retries + 1}):`,
      error.message
    );

    if (retries < MAX_RETRIES - 1) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(uri, retries + 1);
    }

    console.error(
      "❌ Failed to connect to MongoDB after",
      MAX_RETRIES,
      "attempts"
    );
    throw error;
  }
};

export default connectWithRetry;
