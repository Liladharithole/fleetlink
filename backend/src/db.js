import mongoose from "mongoose";

export default async (uri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "fleetlink" });
};
