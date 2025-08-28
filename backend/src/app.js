import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.use("/", (req, res) => {
  res.send("API IS WORKING");
});

//

export default app;
