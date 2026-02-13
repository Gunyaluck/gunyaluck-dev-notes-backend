import connectionPool from "../utils/db.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * Check if username already exists
 * @param {string} username - Username to check
 * @returns {Object|null} Existing user or null
 */
export const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await connectionPool.query(query, [username]);
  return result.rows[0] || null;
};

/**
 * Create new user in database
 * @param {string} userId - Supabase user ID
 * @param {string} username - Username
 * @param {string} name - User name
 * @param {string} role - User role (default: "user")
 * @returns {Object} Created user
 */
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

/**
 * Sign up user with Supabase Auth
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Supabase auth response
 */
export const signUpWithSupabase = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

/**
 * Sign in user with Supabase Auth
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Supabase auth response
 */
export const signInWithSupabase = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

/**
 * Get user from Supabase Auth by token
 * @param {string} token - JWT token
 * @returns {Object} Supabase user data
 */
export const getUserFromSupabase = async (token) => {
  return await supabase.auth.getUser(token);
};

/**
 * Get user from database by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User data or null
 */
export const findUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await connectionPool.query(query, [userId]);
  return result.rows[0] || null;
};

/**
 * Update user password in Supabase
 * @param {string} newPassword - New password
 * @returns {Object} Supabase response
 */
export const updatePasswordInSupabase = async (newPassword) => {
  return await supabase.auth.updateUser({ password: newPassword });
};

/**
 * Update user profile in database
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data (name, username, bio)
 * @returns {Object} Updated user
 */
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
