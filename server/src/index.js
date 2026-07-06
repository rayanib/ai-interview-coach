import "dotenv/config";
import cors from "cors";
import express from "express";
import { cvRouter } from "./routes/cvRoutes.js";
import { interviewRouter } from "./routes/interviewRoutes.js";
import { jobRouter } from "./routes/jobRoutes.js";
import { reportRouter } from "./routes/reportRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// CORS allows the Vite frontend to call this backend during local development.
app.use(cors());
// JSON parsing makes request.body available in API routes.
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (request, response) => {
  response.json({ message: "AI Interview Coach API is running." });
});

app.use("/api/cv", cvRouter);
app.use("/api/job", jobRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/report", reportRouter);

// This shared error handler gives the frontend a readable error message.
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: error.message || "Something went wrong on the server." });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
