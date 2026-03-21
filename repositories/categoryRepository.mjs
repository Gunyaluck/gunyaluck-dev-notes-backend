import connectionPool from "../utils/db.mjs";

export const getAllCategories = async () => {
  const query = `SELECT id, name FROM categories ORDER BY id`;
  const result = await connectionPool.query(query);
  return result.rows;
};

export const createCategory = async (categoryData) => {
  const query = `INSERT INTO categories (name) VALUES ($1) RETURNING *`;
  const result = await connectionPool.query(query, [categoryData.name]);
  return result.rows[0];
};

export const updateCategory = async (categoryId, categoryData) => {
  const query = `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`;
  const result = await connectionPool.query(query, [categoryData.name, categoryId]);
  return result.rows[0];
};

export const deleteCategory = async (categoryId) => {
  const query = `DELETE FROM categories WHERE id = $1 RETURNING *`;
  const result = await connectionPool.query(query, [categoryId]);
  return result.rows[0];
};