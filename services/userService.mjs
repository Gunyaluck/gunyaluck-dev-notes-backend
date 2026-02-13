import * as userRepository from "../repositories/userRepository.mjs";

export const updateProfilePicture = async (userId, file, profilePictureUrl) => {
  let imageUrl = profilePictureUrl;

  // If file is provided, upload it to Supabase Storage
  if (file) {
    if (!file.buffer || !file.originalname) {
      throw new Error("Invalid file provided");
    }
    imageUrl = await userRepository.uploadProfilePicture(file);
  }

  // If no file and no URL provided, throw error
  if (!imageUrl) {
    throw new Error("Profile picture file or URL is required");
  }

  // Update profile picture in database
  return await userRepository.updateProfilePicture(userId, imageUrl);
};

export const getProfilePicture = async (userId) => {
  return await userRepository.getProfilePicture(userId);
};
