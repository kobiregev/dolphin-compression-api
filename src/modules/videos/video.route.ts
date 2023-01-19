import express from "express";
import fileUpload from "express-fileupload";
import { verifyUser } from "../../utils/verifyUser";
import { compressVideoHandler } from "./video.controller";
import { MAX_FIELD_SIZE, MAX_REQUEST_TIME } from "../../utils/constants";
import { processRequest } from "zod-express-middleware";
import { compressVideoSchema } from "./video.schema";
const router = express.Router();

// TODO Move fileupload to default config
router.post(
  "/compress",
  [
    verifyUser,
    processRequest(compressVideoSchema),
    fileUpload({
      tempFileDir: "temp",
      useTempFiles: true,
      uploadTimeout: MAX_REQUEST_TIME,
      abortOnLimit: true,
      limits: {
        fieldSize: MAX_FIELD_SIZE,
        files: 1, //Max field
      },
    }),
  ],
  compressVideoHandler
);
export default router;
