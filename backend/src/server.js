import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connection to MongoDB
connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
      console.log(`Connected to Database`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
