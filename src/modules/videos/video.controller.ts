import crypto from "crypto";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import {
  DEFAULT_COMPRESSION_PERCENTAGE,
  VIDEO_MIME_TYPES,
} from "../../utils/constants";
import { runFFmpeg } from "./video.process";
import logger from "../../utils/logger";
import { deleteFiles } from "./video.service";
import { CompressVideoQuery } from "./video.schema";
import { stat } from "node:fs/promises";
import { filesize } from "filesize";

export async function compressVideoHandler(
  req: Request<{}, {}, CompressVideoQuery>,
  res: Response
) {
  try {
    const video = req.files?.video as UploadedFile;
    const {
      width,
      height,
      compression = DEFAULT_COMPRESSION_PERCENTAGE,
    } = req.query;
    const tempFilePath = video?.tempFilePath;

    if (!video || !tempFilePath || !VIDEO_MIME_TYPES.includes(video.mimetype)) {
      await deleteFiles(tempFilePath);
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");
    }
    console.log({ compression });

    const fileType = video.mimetype.split("/")[1];

    const outputFilePath = `${process.cwd()}/temp/${crypto.randomUUID()}.${fileType}`;

    res.on("finish", async () => {
      await deleteFiles(tempFilePath, outputFilePath);
    });

    await runFFmpeg(
      tempFilePath,
      outputFilePath,
      width as string,
      height as string,
      compression as string
    );

    const videoStats = await stat(outputFilePath);
    const fileSize = filesize(videoStats.size, { base: 2, standard: "jedec" }).toString();
    res.setHeader("fileSize", fileSize);
    res.status(StatusCodes.OK).sendFile(outputFilePath);
    // res.status(StatusCodes.OK).send("ok");
  } catch (error: any) {
    logger.error(error, `compressVideoHandler: error compression video failed`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error?.message || "");
  }
}
