import connectionPool from "../utils/db.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const getPostById = async (postId) => {
  const result = await connectionPool.query(
    `SELECT posts.*,
            users.name AS author_name,
            users.profile_pic AS author_avatar,
            users.bio AS author_bio
     FROM posts
     LEFT JOIN users ON users.id = posts.user_id
     WHERE posts.id = $1`,
    [postId]
  );
  return result.rows[0];
};

const buildPostsQuery = (filters, statusCondition) => {
  const { category, keyword, limit, offset } = filters;

  let query = `
    SELECT posts.id, posts.image, posts.status_id, categories.name AS category, posts.title, 
           posts.description, posts.date, posts.content, statuses.status, posts.likes_count,
           users.name AS author_name,
           users.profile_pic AS author_avatar
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
    LEFT JOIN users ON users.id = posts.user_id
    WHERE ${statusCondition}
  `;
  let values = [];

  if (category && keyword) {
    query += `
      AND categories.name ILIKE $1 
      AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
    `;
    values = [`%${category}%`, `%${keyword}%`];
  } else if (category) {
    query += " AND categories.name ILIKE $1";
    values = [`%${category}%`];
  } else if (keyword) {
    query += `
      AND (posts.title ILIKE $1 
      OR posts.description ILIKE $1 
      OR posts.content ILIKE $1)
    `;
    values = [`%${keyword}%`];
  }

  query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  return { query, values };
};

// โพสต์ทั้งหมด (status_id = 1 และ 2)
export const getAllPosts = async (filters) => {
  const { query, values } = buildPostsQuery(filters, "posts.status_id IN (1, 2)");
  const result = await connectionPool.query(query, values);
  return result.rows;
};

// โพสต์ที่เผยแพร่แล้วเท่านั้น (status_id = 2)
export const getPublishPosts = async (filters) => {
  const { query, values } = buildPostsQuery(filters, "posts.status_id = 2");
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
  const query = `SELECT 
  posts.*,
  users.name AS author_name
  FROM posts
  JOIN users ON posts.user_id = users.id
  WHERE posts.id = $1`;
  const result = await connectionPool.query(query, [postId]);
  return result.rows[0];
};

const buildCountQuery = (filters, statusCondition) => {
  const { category, keyword } = filters;

  let countQuery = `
    SELECT COUNT(*)
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
    WHERE ${statusCondition}
  `;
  let countValues = [];

  if (category && keyword) {
    countQuery += `
      AND categories.name ILIKE $1 
      AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
    `;
    countValues = [`%${category}%`, `%${keyword}%`];
  } else if (category) {
    countQuery += " AND categories.name ILIKE $1";
    countValues = [`%${category}%`];
  } else if (keyword) {
    countQuery += `
      AND (posts.title ILIKE $1 
      OR posts.description ILIKE $1 
      OR posts.content ILIKE $1)
    `;
    countValues = [`%${keyword}%`];
  }

  return { countQuery, countValues };
};

export const countPosts = async (filters, statusCondition = "posts.status_id IN (1, 2)") => {
  const { countQuery, countValues } = buildCountQuery(filters, statusCondition);
  const countResult = await connectionPool.query(countQuery, countValues);
  return parseInt(countResult.rows[0].count, 10);
};

// นับโพสต์ที่เผยแพร่แล้วเท่านั้น
export const countPublishPosts = async (filters) => {
  return countPosts(filters, "posts.status_id = 2");
};

export const createPost = async (postData) => {
  const query = `
    INSERT INTO posts (title, image, category_id, description, date, content, status_id, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [
    postData.title,
    postData.image,
    postData.category_id,
    postData.description,
    postData.date ?? new Date(),
    postData.content,
    postData.status_id,
    postData.user_id,
  ];

  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const updatePost = async (postId, postData) => {
  const query = `
    UPDATE posts
    SET image = $1, category_id = $2, title = $3, description = $4, 
        date = $5, content = $6, status_id = $7, likes_count = $8
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
    postData.likes_count || postData.like_count || 0,
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

export const uploadImage = async (file) => {
  const bucketName = "personal-blog-db";
  const filePath = `posts/${Date.now()}_${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(data.path);

  return publicUrl;
};
