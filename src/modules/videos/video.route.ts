import express from "express";
import { compressVideoHandler, testQueue } from "./video.controller";

const router = express.Router();

router.post("/compress", compressVideoHandler);
router.post("/testme", testQueue);
export default router;
