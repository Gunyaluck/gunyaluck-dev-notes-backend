import express from "express";
import * as categoryControllers from "../controllers/categoryControllers.mjs";
import { protectAdmin } from "../middlewares/protect.mjs";

const router = express.Router();

router.get("/", categoryControllers.getAllCategories);
router.post("/", protectAdmin, categoryControllers.createCategory);
router.put("/:id", protectAdmin, categoryControllers.updateCategory);
router.delete("/:id", protectAdmin, categoryControllers.deleteCategory);

export default router;
