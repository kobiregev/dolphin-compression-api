import express from "express";
import fileUpload from "express-fileupload";
import { processRequest } from "zod-express-middleware";
import { MAX_FIELD_SIZE, MAX_REQUEST_TIME } from "../../utils/constants";
import { verifyUser } from "../../utils/verifyUser";
import { compressFileHandler } from "./compress.controller";
import { compressFileSchema } from "./compress.schema";

const router = express.Router();

router.post(
  "/compress",
  [
    verifyUser,
    // @ts-ignore
    processRequest(compressFileSchema),
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
  compressFileHandler
);

export default router;
