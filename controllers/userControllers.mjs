import * as userService from "../services/userService.mjs";

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.files?.profilePicture?.[0];
    const { profilePicture } = req.body;

    // Validate that either file or URL is provided
    if (!file && !profilePicture) {
      return res.status(400).json({
        message: "Profile picture file or URL is required",
        error: "Missing profilePicture in request",
      });
    }

    // Update profile picture
    const user = await userService.updateProfilePicture(userId, file, profilePicture);

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: user.profile_pic,
    });
  } catch (err) {
    console.error(err);
    
    if (err.message === "Profile picture file or URL is required" || 
        err.message === "Invalid file provided") {
      return res.status(400).json({
        message: err.message,
        error: err.message,
      });
    }

    return res.status(500).json({
      message: "Server could not update profile picture",
      error: err.message || "Internal server error",
    });
  }
};

export const getProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const profilePicture = await userService.getProfilePicture(userId);

    return res.status(200).json({
      profilePicture,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not get profile picture",
      error: err.message || "Internal server error",
    });
  }
};
