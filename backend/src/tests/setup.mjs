// src/tests/setup.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/fleetlink_test";
  await mongoose.connect(uri, {
    dbName: "fleetlink_test",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});
