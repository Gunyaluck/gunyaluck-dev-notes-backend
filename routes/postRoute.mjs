import express from "express";
import * as postControllers from "../controllers/postControllers.mjs";
import postValidation from "../middlewares/postValidation.mjs";

const router = express.Router();

router.get("/", postControllers.getAllPosts);
router.get("/:id", postControllers.getPostById);
router.post("/", postValidation, postControllers.createPost);
router.put("/:id", postValidation, postControllers.updatePost);
router.delete("/:id", postControllers.deletePost);

export default router;
