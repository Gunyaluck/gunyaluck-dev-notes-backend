import 'dotenv/config';

import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";
import postRoutes from "./routes/postRoute.mjs";
import authRoutes from "./routes/authRoute.mjs";
import notificationRoutes from "./routes/notificationRoute.mjs";
import categoryRoutes from "./routes/categoryRoute.mjs";
import statusRoutes from "./routes/statusRoute.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gunyaluck-dev-notes-git-dev-mogunyalucks-projects.vercel.app",
  "https://pjsdf.online",
  "https://www.pjsdf.online",
];
if (process.env.CORS_ORIGINS) {
  allowedOrigins.push(
    ...process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  );
}

app.use(cors({ origin: allowedOrigins }));

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/health", async (req, res) => {
  const result = await connectionPool.query("SELECT * FROM posts;");
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Database connection error" });
  }
  else {
    res.status(200).json({ result: result.rows });
  }
});

// Use routes
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
app.use("/notifications", notificationRoutes);
app.use("/categories", categoryRoutes);
app.use("/statuses", statusRoutes);

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}

export default app;
