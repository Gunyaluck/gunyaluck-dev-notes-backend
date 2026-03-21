import { Router } from "express";
import { protectUser, protectAdmin } from "../middlewares/protect.mjs";
import * as authControllers from "../controllers/authControllers.mjs";
import * as userControllers from "../controllers/userControllers.mjs";
import multer from "multer";

const authRouter = Router();

// Configure multer for file uploads
const multerUpload = multer({ storage: multer.memoryStorage() });
const profilePictureUpload = multerUpload.fields([
  { name: "profilePicture", maxCount: 1 },
]);

// Auth routes
authRouter.post("/register", authControllers.register);
authRouter.post("/login", authControllers.login);
authRouter.get("/get-user", authControllers.getUser);
authRouter.get("/landing-author", authControllers.getLandingAuthor);
authRouter.put("/reset-password", authControllers.resetPassword);

// Protected routes
authRouter.get("/protected-route", protectUser, (req, res) => {
  res.json({ message: "This is protected content", user: req.user });
});

authRouter.get("/admin-only", protectAdmin, (req, res) => {
  res.json({ message: "This is admin-only content", admin: req.user });
});

// Profile routes
authRouter.get("/profile-picture", protectUser, userControllers.getProfilePicture);
authRouter.patch("/profile-picture", protectUser, profilePictureUpload, userControllers.updateProfilePicture);
authRouter.patch("/profile", protectUser, authControllers.updateProfile);

export default authRouter;