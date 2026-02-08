import 'dotenv/config';

import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://gunyaluck-dev-notes-git-dev-mogunyalucks-projects.vercel.app",
    ],
  })
);

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/health", async (req, res) => {
  const result = await connectionPool.query("SELECT * FROM posts;");
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Database connection error" });
  }
  else {
    res.status(200).json({ result: result.rows});
  }
});

app.get("/posts", async (req, res) => {
  try {
    const result = await connectionPool.query("select * from posts;");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
});

app.post("/posts", async (req, res) => {
  const newPost = req.body;

  try {
    const query = `
      insert into posts (title, image, category_id, description, content, status_id)
      values ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];

    await connectionPool.query(query, values);
    res.status(201).json({ message: "Created post successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

if (process.env.VERCEL !== "1") 
  { app.listen(port, () => 
    { console.log(`✅ Server running on http://localhost:${port}`); 
  }); }

export default app;