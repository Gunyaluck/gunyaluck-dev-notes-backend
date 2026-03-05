import * as authService from "../services/authService.mjs";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await authService.register({ email, password, username, name });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (
      error.message === "This username is already taken" ||
      error.message === "User with this email already exists" ||
      error.message === "Failed to create user. Please try again."
    ) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "An error occurred during registration" });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.login({ email, password });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    
    if (
      error.message === "Your password is incorrect or this email doesn't exist"
    ) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: error.message || "An error occurred during login" });
  }
};

/**
 * Get user by token
 */
export const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const user = await authService.getUserByToken(token);

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    
    if (error.message === "Unauthorized or token expired" || error.message === "User not found") {
      return res.status(401).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { oldPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const result = await authService.resetPassword(token, oldPassword, newPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error.message === "New password is required") {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.message === "Invalid old password") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get landing author (admin profile for public landing page)
 */
export const getLandingAuthor = async (req, res) => {
  try {
    const author = await authService.getLandingAuthor();
    if (!author) {
      return res.status(404).json({ message: "Landing author not found" });
    }
    res.status(200).json({
      name: author.name,
      profile_pic: author.profile_pic,
      bio: author.bio,
    });
  } catch (error) {
    console.error("Get landing author error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body || {};
    const { name, username, bio } = body;

    const profile = await authService.updateProfile(userId, { name, username, bio });

    res.status(200).json({
      message: "Updated profile successfully",
      profile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
