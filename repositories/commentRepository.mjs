import connectionPool from "../utils/db.mjs";

export const getCommentByPostId = async (postId) => {
  const query = `
    SELECT comments.*, users.name, users.profile_pic
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = $1
    AND comments.parent_id IS NULL
    ORDER BY comments.created_at DESC
  `;
  const result = await connectionPool.query(query, [postId]);
  return result.rows;
};

export const createCommentByPostId = async (postId, commentData) => {
  const query = `INSERT INTO comments (post_id, user_id, comment_text, created_at, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [
    postId,
    commentData.user_id,
    commentData.comment_text,
    new Date(),
    commentData.parent_id ?? null,
  ];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const getRepliesByCommentId = async (commentId) => {
  const query = `
    SELECT comments.*, users.name, users.profile_pic
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.parent_id = $1
    ORDER BY comments.created_at ASC
  `;
  
  const result = await connectionPool.query(query, [commentId]);
  return result.rows;
};
