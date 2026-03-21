import connectionPool from "../utils/db.mjs";

export const getLikeCountByPostId = async (postId) => {
  const result = await connectionPool.query(
    `SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1`,
    [postId]
  );
  return result.rows[0].count;
};

export const getUserLikeByPostId = async (postId, userId) => {
  const result = await connectionPool.query(
    `SELECT id FROM likes WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return result.rows[0] ?? null;
};

export const createLikeByPostId = async (postId, likeData) => {
  const query = `INSERT INTO likes (post_id, user_id, liked_at) VALUES ($1, $2, $3) RETURNING *`;
  const result = await connectionPool.query(query, [postId, likeData.user_id, new Date()]);
  return result.rows[0];
};

export const deleteLikeByPostIdAndUserId = async (postId, userId) => {
  await connectionPool.query(
    `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  );
  await connectionPool.query(
    `DELETE FROM notifications WHERE type = 'like' AND actor_id = $1 AND post_id = $2`,
    [userId, postId]
  );
};
