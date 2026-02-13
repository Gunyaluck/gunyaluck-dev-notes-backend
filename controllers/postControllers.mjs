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
    const comment = await postService.createCommentByPostId(postId, req.body);
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
    const like = await postService.createLikeByPostId(postId, req.body);
    res.status(201).json({ message: "Created like successfully", like });
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
    const like = await postService.deleteLikeByPostId(postId, req.body.user_id);
    res.status(200).json({ message: "Deleted like successfully", like });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not delete like because database connection" });
  }
};