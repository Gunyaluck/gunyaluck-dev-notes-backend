import * as authRepository from "../repositories/authRepository.mjs";

export const register = async (userData) => {
  const { email, password, username, name } = userData;

  // Check if username already exists
  const existingUser = await authRepository.findUserByUsername(username);
  if (existingUser) {
    throw new Error("This username is already taken");
  }

  // Sign up with Supabase Auth
  const { data, error: supabaseError } = await authRepository.signUpWithSupabase(email, password);
  
  if (supabaseError) {
    if (supabaseError.code === "user_already_exists") {
      throw new Error("User with this email already exists");
    }
    throw new Error("Failed to create user. Please try again.");
  }

  // Create user in database
  const supabaseUserId = data.user.id;
  const user = await authRepository.createUser(supabaseUserId, username, name, "user");

  return user;
};

export const login = async (credentials) => {
  const { email, password } = credentials;

  const { data, error } = await authRepository.signInWithSupabase(email, password);
  
  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message.includes("Invalid login credentials")
    ) {
      throw new Error("Your password is incorrect or this email doesn't exist");
    }
    throw new Error(error.message);
  }

  return {
    message: "Signed in successfully",
    access_token: data.session.access_token,
  };
};

export const getUserByToken = async (token) => {
  // Get user from Supabase Auth
  const { data, error } = await authRepository.getUserFromSupabase(token);
  
  if (error) {
    throw new Error("Unauthorized or token expired");
  }

  // Get user from database
  const supabaseUserId = data.user.id;
  const user = await authRepository.findUserById(supabaseUserId);
  
  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    profilePic: user.profile_pic,
    bio: user.bio,
  };
};

export const resetPassword = async (token, oldPassword, newPassword) => {
  if (!newPassword) {
    throw new Error("New password is required");
  }

  // Get user from Supabase Auth
  const { data: userData } = await authRepository.getUserFromSupabase(token);
  
  // Verify old password
  const { error: loginError } = await authRepository.signInWithSupabase(
    userData.user.email,
    oldPassword
  );
  
  if (loginError) {
    throw new Error("Invalid old password");
  }

  // Update password
  const { error } = await authRepository.updatePasswordInSupabase(newPassword);
  
  if (error) {
    throw new Error(error.message);
  }

  return { message: "Password updated successfully" };
};

export const updateProfile = async (userId, profileData) => {
  const user = await authRepository.findUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await authRepository.updateUserProfile(userId, profileData);
  
  return updatedUser;
};

export const getLandingAuthor = async () => {
  return await authRepository.findLandingAuthor();
};
