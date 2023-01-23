import crypto from "crypto";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import logger from "../../utils/logger";
import {
  COMPRESS_MIME_TYPES,
  DEFAULT_COMPRESSION_PERCENTAGE,
} from "../../utils/constants";
import { deleteFiles, getFileSize } from "../../services/file";
import { runFFmpeg } from "../../services/ffmpeg.process";
import { getCommand } from "../../services/ffmpeg.commands";
import { CompressFileQuery } from "./compress.schema";

export async function compressFileHandler(
  req: Request<{}, {}, {}, CompressFileQuery>,
  res: Response
) {
  try {
    const file = req.files?.file as UploadedFile;
    const {
      width,
      height,
      compression = DEFAULT_COMPRESSION_PERCENTAGE,
    } = req.query;

    const tempFilePath = file?.tempFilePath;

    if (
      !file ||
      !tempFilePath ||
      !COMPRESS_MIME_TYPES.includes(file.mimetype)
    ) {
      // Get file keys and find each tempfilepath to delete wrong named files
      const fileKeys = Object.keys(req.files as object);
      const tempFilePaths = fileKeys.map(
        (key) => (req.files?.[key] as UploadedFile).tempFilePath
      );
      await deleteFiles(...tempFilePaths);
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");
    }

    const fileType = file.mimetype.split("/")[1];
    console.log({ fileType });

    const outputFilePath = `${process.cwd()}/temp/${crypto.randomUUID()}.${fileType}`;

    res.on("finish", async () => {
      await deleteFiles(tempFilePath, outputFilePath);
    });

    await runFFmpeg({
      input: tempFilePath,
      output: outputFilePath,
      ffmpegCommands: getCommand({
        width,
        height,
        compression,
        fileType,
      }),
    });

    const [data, error] = await getFileSize(outputFilePath);

    if (error) throw error;

    res.header("fileSize", data);
    res.status(StatusCodes.OK).sendFile(outputFilePath);
  } catch (error: any) {
    logger.error(error, `compressGifHandler: Error gif video failed`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error?.message || "");
  }
}
