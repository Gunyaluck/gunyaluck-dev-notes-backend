import connectionPool from "../utils/db.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const uploadProfilePicture = async (file) => {
  const bucketName = "personal-blog-db";
  const filePath = `profile-pictures/${Date.now()}_${file.originalname}`;

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

export const updateProfilePicture = async (userId, profilePictureUrl) => {
  const query = `UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING *`;
  const values = [profilePictureUrl, userId];
  const result = await connectionPool.query(query, values);
  return result.rows[0];
};

export const getProfilePicture = async (userId) => {
  const query = `SELECT profile_pic FROM users WHERE id = $1`;
  const result = await connectionPool.query(query, [userId]);
  return result.rows[0]?.profile_pic || null;
};
