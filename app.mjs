import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello TechUp!");
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
