import express from "express";
import fileUpload from "express-fileupload";
import { processRequest } from "zod-express-middleware";
import { MAX_FIELD_SIZE, MAX_REQUEST_TIME } from "../../utils/constants";
import { verifyUser } from "../../utils/verifyUser";
import { compressGifHandler } from "./gif.controller";
import { compressGifSchema } from "./gif.schema";

const router = express.Router();

router.post(
  "/compress",
  [
    verifyUser,
    // @ts-ignore
    processRequest(compressGifSchema),
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
  compressGifHandler
);

export default router;
