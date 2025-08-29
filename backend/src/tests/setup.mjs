// src/tests/setup.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  // Use dedicated TEST URI/DB to avoid wiping real data
  const uri =
    process.env.MONGODB_URI_TEST ||
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/fleetlink_test";
  const dbName = process.env.MONGODB_DBNAME_TEST || "fleetlink_test";

  await mongoose.connect(uri, {
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Safety: only drop test databases
  const currentDbName = mongoose.connection.name || "";
  if (/test/i.test(currentDbName)) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
