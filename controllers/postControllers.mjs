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
