import { Router } from "express";
import * as userControllers from "../controllers/userControllers.mjs";
import { protectUser, protectAdmin } from "../middlewares/protect.mjs";

const userRouter = Router();

const profilePictureUpload = multerUpload.fields([
    { name: "profilePicture", maxCount: 1 },
  ]);
// Get profile picture route
userRouter.get("/profile-picture", protectUser, userControllers.getProfilePicture);

// Update profile picture route (supports both file upload and URL)
userRouter.patch("/profile-picture", protectUser, profilePictureUpload, userControllers.updateProfilePicture);

