import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import questionRoute from "./Routes/question.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/questions", questionRoute);

app.get("/", (req: Request, res: Response) => {
  try {
    res.send("Welcome to the Astrology AI API");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
