import crypto from "crypto";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import logger from "../../utils/logger";
import {
  DEFAULT_COMPRESSION_PERCENTAGE,
  GIF_MIME_TYPES,
} from "../../utils/constants";
import { deleteFiles, getFileSize } from "../../services/file";
import { runFFmpeg } from "../../services/ffmpeg.process";

export async function compressGifHandler(req: Request, res: Response) {
  try {
    const gif = req.files?.gif as UploadedFile;
    const {
      width,
      height,
      compression = DEFAULT_COMPRESSION_PERCENTAGE,
    } = req.query;

    const tempFilePath = gif?.tempFilePath;

    if (!gif || !tempFilePath || !GIF_MIME_TYPES.includes(gif.mimetype)) {
      // Get file keys and find each tempfilepath to delete wrong named files
      const fileKeys = Object.keys(req.files as object);
      const tempFilePaths = fileKeys.map(
        (key) => (req.files?.[key] as UploadedFile).tempFilePath
      );
      await deleteFiles(...tempFilePaths);
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");
    }

    const fileType = gif.mimetype.split("/")[1];

    const outputFilePath = `${process.cwd()}/temp/${crypto.randomUUID()}.${fileType}`;

    res.on("finish", async () => {
      await deleteFiles(tempFilePath, outputFilePath);
    });

    await runFFmpeg({
      input: tempFilePath,
      output: outputFilePath,
      compression: compression as string,
      width: width as string,
      height: height as string,
      ffmpegCommands: ["-vf",`fps=10,scale=${width}:${height}:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`],
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
