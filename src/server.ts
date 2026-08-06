import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    app: process.env.APP_NAME,
    status: "Running",
    message: "🧠 S-BRAIN Backend is Alive!"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ${process.env.APP_NAME} running on port ${PORT}`);
});