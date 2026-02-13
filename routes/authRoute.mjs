import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";
import { protectUser, protectAdmin } from "../middlewares/protect.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const authRouter = Router();
// จะเพิ่ม routes ต่างๆ ที่นี่

// Register route
authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;
  try {
    const usernameCheckQuery = `
      SELECT * FROM users
      WHERE username = $1
    `;
    const usernameCheckValues = [username];
    const { rows: existingUser } = await connectionPool.query(
      usernameCheckQuery,
      usernameCheckValues
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    //sign up with supabase new user
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;
    //insert user into database
    //email. password ไม่ต้องเพิ่มเข้าไปใน database เพราะมันจะถูกเก็บใน supabase อยู่แล้ว ในบรรทัดที่30
    const query = `
      INSERT INTO users (id, username, name, role) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [supabaseUserId, username, name, "user"];
    const { rows } = await connectionPool.query(query, values);
    res.status(201).json({
      message: "User created successfully",
      user: rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

// Login route
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
        });
      }
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({
      message: "Signed in successfully",
      access_token: data.session.access_token, //แนบtoken ถูกเก็บใน data บรรทัดที่ 70 หรือคือ jwt token
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

// Get user route
authRouter.get("/get-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }
    const supabaseUserId = data.user.id;
    const query = `
      SELECT * FROM users
      WHERE id = $1
    `;
    const values = [supabaseUserId];
    const { rows } = await connectionPool.query(query, values);
    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: rows[0].username,
      name: rows[0].name,
      role: rows[0].role,
      profilePic: rows[0].profile_pic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protect user route
authRouter.get("/protected-route", protectUser, (req, res) => {
  res.json({ message: "This is protected content", user: req.user });
});

// Protect admin route
authRouter.get("/admin-only", protectAdmin, (req, res) => {
  res.json({ message: "This is admin-only content", admin: req.user });
});

// Reset password route
authRouter.put("/reset-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }
  try {
    const { data: userData } = await supabase.auth.getUser(token);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: oldPassword,
    });
    if (loginError) {
      return res.status(400).json({ error: "Invalid old password" });
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update profile route — PATCH /auth/profile
authRouter.patch("/profile", protectUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, bio } = req.body;

    const query = `
      UPDATE users 
      SET name = COALESCE($1, name), username = COALESCE($2, username), bio = COALESCE($3, bio)
      WHERE id = $4 
      RETURNING *
    `;
    const values = [name ?? null, username ?? null, bio ?? null, userId];

    const { rows } = await connectionPool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Updated profile successfully",
      profile: rows[0],
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default authRouter;