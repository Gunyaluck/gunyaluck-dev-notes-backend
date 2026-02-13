import express from "express";
import * as postControllers from "../controllers/postControllers.mjs";
import postValidation from "../middlewares/postValidation.mjs";
import { protectUser, protectAdmin } from "../middlewares/protect.mjs";
import multer from "multer";

const router = express.Router();

const multerUpload = multer({ storage: multer.memoryStorage() });

const imageFileUpload = multerUpload.fields([
    { name: "imageFile", maxCount: 1 },
]);

router.get("/", postControllers.getAllPosts);
router.get("/:id", postControllers.getPostById);
router.post("/", protectAdmin, imageFileUpload, postControllers.createPostWithImage);
router.get("/admin", protectAdmin, postControllers.getAdminPosts);
router.get("/admin/:id", protectAdmin, postControllers.getAdminPostById);
router.put("/:id", protectAdmin, imageFileUpload, postControllers.updatePostWithImage);
router.delete("/:id", protectAdmin, postControllers.deletePost);
router.get("/:id/comments", postControllers.getCommentByPostId);
router.post("/:id/comments", protectUser, postValidation, postControllers.createCommentByPostId);
router.get("/:id/likes", postControllers.getLikeByPostId);
router.post("/:id/likes", protectUser, postValidation, postControllers.createLikeByPostId);
router.delete("/:id/likes", protectUser, postControllers.deleteLikeByPostId);

export default router;
