import * as postRepository from "../repositories/postRepository.mjs";

export const getPostById = async (postId) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

export const getAllPosts = async (queryParams) => {
  const category = queryParams.category || "";
  const keyword = queryParams.keyword || "";
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(queryParams.limit) || 6));
  const offset = (page - 1) * limit;

  const filters = { category, keyword, limit, offset };
  
  const [posts, totalPosts] = await Promise.all([
    postRepository.getAllPosts(filters),
    postRepository.countPosts({ category, keyword }),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);
  
  const results = {
    totalPosts,
    totalPages,
    currentPage: page,
    limit,
    posts,
  };

  if (offset + limit < totalPosts) {
    results.nextPage = page + 1;
  }

  if (offset > 0) {
    results.previousPage = page - 1;
  }

  return results;
};

export const createPost = async (postData) => {
  const requiredFields = ['title', 'image', 'category_id', 'description', 'content', 'status_id'];
  const missingFields = requiredFields.filter(field => !postData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return await postRepository.createPost(postData);
};

export const getAdminPosts = async (queryParams) => {
  const category = queryParams.category || "";
  const keyword = queryParams.keyword || "";
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(queryParams.limit) || 6));
  const offset = (page - 1) * limit;
  
  const filters = { category, keyword, limit, offset };
};

export const getAdminPostById = async (postId) => {
  return await postRepository.getAdminPostById(postId);
};

export const updatePost = async (postId, postData) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const requiredFields = ['title', 'image', 'category_id', 'description', 'content', 'status_id'];
  const missingFields = requiredFields.filter(field => !postData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return await postRepository.updatePost(postId, postData);
};

export const deletePost = async (postId) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  return await postRepository.deletePost(postId);
};

export const getCommentByPostId = async (postId) => {
  return await postRepository.getCommentByPostId(postId);
};

export const createCommentByPostId = async (postId, commentData) => {
  return await postRepository.createCommentByPostId(postId, commentData);
};

export const getLikeByPostId = async (postId) => {
  return await postRepository.getLikeByPostId(postId);
};

export const createLikeByPostId = async (postId, likeData) => {
  return await postRepository.createLikeByPostId(postId, likeData);
};

export const deleteLikeByPostId = async (postId, userId) => {
  return await postRepository.deleteLikeByPostId(postId, userId);
};