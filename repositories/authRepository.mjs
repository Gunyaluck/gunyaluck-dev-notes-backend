import connectionPool from "../utils/db.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


export const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await connectionPool.query(query, [username]);
  return result.rows[0] || null;
};

export const createUser = async (userId, username, name, role = "user") => {
  const query = `
    INSERT INTO users (id, username, name, role) 
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [userId, username, name, role];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const signUpWithSupabase = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signInWithSupabase = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const getUserFromSupabase = async (token) => {
  return await supabase.auth.getUser(token);
};

export const findUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await connectionPool.query(query, [userId]);
  return result.rows[0] || null;
};


export const updatePasswordInSupabase = async (newPassword) => {
  return await supabase.auth.updateUser({ password: newPassword });
};


export const updateUserProfile = async (userId, profileData) => {
  const { name, username, bio } = profileData;
  const query = `
    UPDATE users 
    SET name = COALESCE($1, name), username = COALESCE($2, username), bio = COALESCE($3, bio)
    WHERE id = $4 
    RETURNING *
  `;
  const values = [name ?? null, username ?? null, bio ?? null, userId];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const findLandingAuthor = async () => {
  const query = `SELECT name, profile_pic, bio FROM users WHERE role = 'admin' LIMIT 1`;
  const result = await connectionPool.query(query);
  return result.rows[0] || null;
};
