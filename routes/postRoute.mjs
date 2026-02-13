import express from "express";
import * as postControllers from "../controllers/postControllers.mjs";
import postValidation from "../middlewares/postValidation.mjs";
import { protectUser, protectAdmin } from "../middlewares/protect.mjs";

const router = express.Router();

router.get("/", postControllers.getAllPosts);
router.get("/:id", postControllers.getPostById);
router.post("/", postValidation, postControllers.createPost);
router.get("/admin", protectAdmin, postControllers.getAdminPosts);
router.get("/admin/:id", protectAdmin, postControllers.getAdminPostById);
router.put("/:id", postValidation, postControllers.updatePost);
router.delete("/:id", protectAdmin, postControllers.deletePost);
router.get("/:id/comments", postControllers.getCommentByPostId);
router.post("/:id/comments", protectUser, postValidation, postControllers.createCommentByPostId);
router.get("/:id/likes", postControllers.getLikeByPostId);
router.post("/:id/likes", protectUser, postValidation, postControllers.createLikeByPostId);
router.delete("/:id/likes", protectUser, postControllers.deleteLikeByPostId);

export default router;
