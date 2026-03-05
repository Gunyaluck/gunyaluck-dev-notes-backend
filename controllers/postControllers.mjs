import * as postService from "../services/postService.mjs";

export const getPostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await postService.getPostById(postId);
    res.status(200).json(post);
  } catch (err) {
    if (err.message === "Post not found") {
      return res.status(404).json({ message: "Server could not find a requested post" });
    }
    console.error(err);
    res.status(500).json({ message: "Server could not read post because database connection" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const results = await postService.getAllPosts(req.query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not read posts because database issue",
    });
  }
};

export const getPublishPosts = async (req, res) => {
  try {
    const results = await postService.getPublishPosts(req.query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not read posts because database issue",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json({ message: "Created post successfully", post });
  } catch (err) {
    console.error(err);
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
};

export const getAdminPosts = async (req, res) => {
  try {
    const results = await postService.getAdminPosts(req.query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not read admin posts because database issue",
    });
  }
};

export const getAdminPostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const post = await postService.getAdminPostById(postId);
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not read admin post because database issue",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await postService.updatePost(postId, req.body);
    res.status(200).json({ message: "Updated post successfully", post });
  } catch (err) {
    console.error(err);
    if (err.message === "Post not found") {
      return res.status(404).json({ message: "Server could not find a requested post to update" });
    }
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server could not update post because database connection" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    await postService.deletePost(postId);
    res.status(200).json({ message: "Deleted post successfully" });
  } catch (err) {
    console.error(err);
    if (err.message === "Post not found") {
      return res.status(404).json({ message: "Server could not find a requested post to delete" });
    }
    res.status(500).json({ message: "Server could not delete post because database connection" });
  }
};

export const getCommentByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const comment = await postService.getCommentByPostId(postId);
    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not read comment because database connection" });
  }
};

export const createCommentByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const commentData = {
      ...req.body,
      user_id: userId,
    };
    const comment = await postService.createCommentByPostId(postId, commentData);
    res.status(201).json({ message: "Created comment successfully", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not create comment because database connection" });
  }
};

export const getLikeByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const like = await postService.getLikeByPostId(postId);
    res.status(200).json(like);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not read like because database connection" });
  }
};

export const createLikeByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const result = await postService.toggleLikeByPostId(postId, userId);
    const status = result.liked ? 201 : 200;
    res.status(status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not create like because database connection" });
  }
};

export const deleteLikeByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const like = await postService.deleteLikeByPostId(postId, userId);
    res.status(200).json({ message: "Deleted like successfully", like });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not delete like because database connection" });
  }
};

export const createPostWithImage = async (req, res) => {
  try {
    if (!req.files || !req.files.imageFile || !req.files.imageFile[0]) {
      return res.status(400).json({ 
        message: "Image file is required",
        error: "Missing imageFile in request" 
      });
    }

    const file = req.files.imageFile[0];
    const userId = req.body.user_id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
        error: "user_id is required",
      });
    }
    const postData = {
      ...req.body,
      user_id: userId,
    };

    const post = await postService.createPostWithImage(postData, file);

    return res.status(201).json({ 
      message: "Created post successfully",
      post 
    });
  } catch (err) {
    console.error(err);
    
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ 
        message: err.message,
        error: err.message 
      });
    }
    
    if (err.message === "Image file is required") {
      return res.status(400).json({ 
        message: err.message,
        error: err.message 
      });
    }

    return res.status(500).json({
      message: "Server could not create post",
      error: err.message || "Internal server error",
    });
  }
};

export const updatePostWithImage = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if new image file is provided
    const hasNewImage = req.files && req.files.imageFile && req.files.imageFile[0];
    const file = hasNewImage ? req.files.imageFile[0] : null;
    const postData = req.body;

    // Debug: Log received data
    console.log("Update post request:", {
      postId,
      hasNewImage: !!file,
      postDataKeys: Object.keys(postData),
      postData: {
        title: postData.title,
        category_id: postData.category_id,
        status_id: postData.status_id,
        description: postData.description ? `${postData.description.substring(0, 50)}...` : null,
        content: postData.content ? `${postData.content.substring(0, 50)}...` : null,
        like_count: postData.like_count,
      }
    });

    // Convert string values to numbers if needed (FormData sends everything as strings)
    if (postData.category_id) {
      postData.category_id = typeof postData.category_id === 'string' 
        ? parseInt(postData.category_id) 
        : Number(postData.category_id);
    }
    if (postData.status_id) {
      postData.status_id = typeof postData.status_id === 'string' 
        ? parseInt(postData.status_id) 
        : Number(postData.status_id);
    }
    if (postData.like_count !== undefined && postData.like_count !== null) {
      postData.like_count = typeof postData.like_count === 'string' 
        ? parseInt(postData.like_count) 
        : Number(postData.like_count);
    }

    const post = await postService.updatePostWithImage(postId, postData, file);

    return res.status(200).json({ 
      message: "Updated post successfully",
      post 
    });
  } catch (err) {
    console.error("Error in updatePostWithImage:", err);
    console.error("Error stack:", err.stack);
    
    if (err.message === "Post not found") {
      return res.status(404).json({ message: "Server could not find a requested post to update" });
    }
    
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ 
        message: err.message,
        error: err.message 
      });
    }
    
    if (err.message === "Image file is required") {
      return res.status(400).json({ 
        message: err.message,
        error: err.message 
      });
    }

    if (err.message.includes("Failed to upload image")) {
      return res.status(500).json({
        message: "Failed to upload image",
        error: err.message 
      });
    }

    return res.status(500).json({
      message: "Server could not update post",
      error: err.message || "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};