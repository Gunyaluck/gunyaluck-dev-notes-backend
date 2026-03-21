import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const protectUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = { ...data.user };
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User authentication required" });
  }
  try {
    const supabaseUserId = req.user.id;
    const query = `
      SELECT role FROM users
      WHERE id = $1
    `;
    const values = [supabaseUserId];
    const { rows } = await connectionPool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ error: "User role not found" });
    }
    req.user.role = rows[0].role;
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have admin access" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    // First validate token (same as protectUser)
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = { ...data.user };

    // Then check admin role (same as requireAdmin)
    const supabaseUserId = data.user.id;
    const query = `
      SELECT role FROM users
      WHERE id = $1
    `;
    const values = [supabaseUserId];
    const { rows } = await connectionPool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ error: "User role not found" });
    }
    req.user.role = rows[0].role;
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have admin access" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { protectUser, requireAdmin, protectAdmin };
export default protectUser;
