import express from "express";
import * as statusControllers from "../controllers/statusControllers.mjs";

const router = express.Router();

router.get("/", statusControllers.getAllStatuses);

export default router;
