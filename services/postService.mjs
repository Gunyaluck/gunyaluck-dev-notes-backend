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

export const createPostWithImage = async (postData, file) => {
  const requiredFields = ['title', 'category_id', 'description', 'content', 'status_id', 'user_id'];
  const missingFields = requiredFields.filter(field => !postData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (!file) {
    throw new Error('Image file is required');
  }

  const imageUrl = await postRepository.uploadImage(file);

  const postDataWithImage = {
    ...postData,
    image: imageUrl,
    category_id: parseInt(postData.category_id),
    status_id: parseInt(postData.status_id),
    // user_id is UUID (string), do not parseInt
    user_id: postData.user_id,
  };

  return await postRepository.createPost(postDataWithImage);
};

export const updatePostWithImage = async (postId, postData, file) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const requiredFields = ['title', 'category_id', 'description', 'content', 'status_id'];
  const missingFields = requiredFields.filter(field => !postData[field] && postData[field] !== 0);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  let imageUrl = post.image; // Default to existing image

  // If new image file is provided, upload it
  if (file) {
    try {
      imageUrl = await postRepository.uploadImage(file);
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
  } else if (postData.image && typeof postData.image === 'string' && postData.image.trim() !== '') {
    // Use provided image URL if no new file
    imageUrl = postData.image;
  }

  const postDataWithImage = {
    title: postData.title,
    image: imageUrl,
    category_id: parseInt(postData.category_id),
    description: postData.description,
    content: postData.content,
    status_id: parseInt(postData.status_id),
    likes_count: postData.like_count !== undefined && postData.like_count !== null 
      ? parseInt(postData.like_count) 
      : (post.likes_count || 0),
  };

  return await postRepository.updatePost(postId, postDataWithImage);
};