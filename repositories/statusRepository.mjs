import connectionPool from "../utils/db.mjs";

export const getAllStatuses = async () => {
  const query = `SELECT id, status FROM statuses ORDER BY id`;
  const result = await connectionPool.query(query);
  return result.rows;
};
