import express from "express";
import { compressVideoHandler } from "./video.controller";

const router = express.Router();

router.post("/compress", compressVideoHandler);
export default router;
