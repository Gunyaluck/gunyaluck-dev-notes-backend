import connectionPool from "../utils/db.mjs";

export const getPostById = async (postId) => {
  const result = await connectionPool.query(
    `SELECT * FROM posts WHERE id = $1`,
    [postId]
  );
  return result.rows[0];
};

export const getAllPosts = async (filters) => {
  const { category, keyword, limit, offset } = filters;
  
  let query = `
    SELECT posts.id, posts.image, categories.name AS category, posts.title, 
           posts.description, posts.date, posts.content, statuses.status, posts.likes_count
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
  `;
  let values = [];

  if (category && keyword) {
    query += `
      WHERE categories.name ILIKE $1 
      AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
    `;
    values = [`%${category}%`, `%${keyword}%`];
  } else if (category) {
    query += " WHERE categories.name ILIKE $1";
    values = [`%${category}%`];
  } else if (keyword) {
    query += `
      WHERE posts.title ILIKE $1 
      OR posts.description ILIKE $1 
      OR posts.content ILIKE $1
    `;
    values = [`%${keyword}%`];
  }

  query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const result = await connectionPool.query(query, values);
  return result.rows;
};

export const getAdminPosts = async (filters) => {
  const { category, keyword, limit, offset } = filters;
  const query = `SELECT * FROM posts WHERE category_id = $1 AND title ILIKE $2 AND description ILIKE $2 AND content ILIKE $2 ORDER BY date DESC LIMIT $3 OFFSET $4`;
  const values = [category, `%${keyword}%`, limit, offset];
  const result = await connectionPool.query(query, values);
  return result.rows;
};

export const getAdminPostById = async (postId) => {
  const query = `SELECT * FROM posts WHERE id = $1`;
  const result = await connectionPool.query(query, [postId]);
  return result.rows[0];
};

export const countPosts = async (filters) => {
  const { category, keyword } = filters;
  
  let countQuery = `
    SELECT COUNT(*)
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
  `;
  let countValues = [];

  if (category && keyword) {
    countQuery += `
      WHERE categories.name ILIKE $1 
      AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
    `;
    countValues = [`%${category}%`, `%${keyword}%`];
  } else if (category) {
    countQuery += " WHERE categories.name ILIKE $1";
    countValues = [`%${category}%`];
  } else if (keyword) {
    countQuery += `
      WHERE posts.title ILIKE $1 
      OR posts.description ILIKE $1 
      OR posts.content ILIKE $1
    `;
    countValues = [`%${keyword}%`];
  }

  const countResult = await connectionPool.query(countQuery, countValues);
  return parseInt(countResult.rows[0].count, 10);
};

export const createPost = async (postData) => {
  const query = `
    INSERT INTO posts (title, image, category_id, description, content, status_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    postData.title,
    postData.image,
    postData.category_id,
    postData.description,
    postData.content,
    postData.status_id,
  ];

  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const updatePost = async (postId, postData) => {
  const query = `
    UPDATE posts
    SET image = $1, category_id = $2, title = $3, description = $4, 
        date = $5, content = $6, status_id = $7, like_count = $8
    WHERE id = $9
    RETURNING *
  `;
  const values = [
    postData.image,
    postData.category_id,
    postData.title,
    postData.description,
    new Date(),
    postData.content,
    postData.status_id,
    postData.like_count,
    postId,
  ];

  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const deletePost = async (postId) => {
  const query = `DELETE FROM posts WHERE id = $1 RETURNING *`;
  const result = await connectionPool.query(query, [postId]);
  return result.rows[0];
};

export const getCommentByPostId = async (postId) => {
  const query = `SELECT * FROM comments WHERE post_id = $1`;
  const result = await connectionPool.query(query, [postId]);
  return result.rows[0];
};

export const createCommentByPostId = async (postId, commentData) => {
  const query = `INSERT INTO comments (post_id, content, user_id) VALUES ($1, $2, $3) RETURNING *`;
  const values = [postId, commentData.content, commentData.user_id];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const getLikeByPostId = async (postId) => {
  const query = `SELECT * FROM likes WHERE post_id = $1`;
  const result = await connectionPool.query(query, [postId]);
  return result.rows[0];
};

export const createLikeByPostId = async (postId, likeData) => {
  const query = `INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *`;
  const values = [postId, likeData.user_id];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const deleteLikeByPostId = async (postId, userId) => {
  const query = `DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *`;
  const values = [postId, userId];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};