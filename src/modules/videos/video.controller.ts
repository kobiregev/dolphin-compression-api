import fs from "fs";
import path from "path";
import crypto from "crypto";
// import ffmpeg, { FfprobeData } from "fluent-ffmpeg";
// import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import { VIDEO_MIME_TYPES } from "../../utils/constants";
import { fork } from "child_process";
import logger from "../../utils/logger";
import { runFFmpeg } from "./video.process";
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// function command(input: any, output: any, bitrate: number, fileExtension: string) {
//   return new Promise<void>((resolve, reject) => {
//     ffmpeg(input)
//       .format(fileExtension)
//       .fps(30)
//       .addOptions(["-vf", "scale=640:480", "-preset", "slow", "-crf", "28"])
//       .output(output)
//       .on("start", (command) => {
//         console.log("TCL: command -> command", command);
//       })
//       .on("error", (error) => {
//         console.log({ error });
//         reject(error);
//       })
//       .on("end", () => {
//         console.log("end");
//         resolve();
//       })
//       .run();
//   });
// }

// function whatBitrate(bytes: number) {
//   const ONE_MB = 1000000;
//   const BIT = 28; // i found that 28 are good point fell free to change it as you feel right
//   const diff = Math.floor(bytes / ONE_MB);
//   if (diff < 5) {
//     return 128;
//   } else {
//     return Math.floor(diff * BIT * 1.1);
//   }
// }

// async function compress(
//   filePath: string,
//   fileName: string,
//   fileExtension: string,
//   bitrate: number
// ) {
//   await command(
//     filePath,
//     `${process.cwd()}/temp/${fileName}.${fileExtension}`,
//     bitrate,
//     fileExtension
//   );
// }

export async function compressVideoHandler(req: Request, res: Response) {
  try {
    const video = req.files?.video as UploadedFile;
    const tempFilePath = video?.tempFilePath;

    if (!video || !tempFilePath || !VIDEO_MIME_TYPES.includes(video.mimetype))
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");

    const fileType = video.mimetype.split("/")[1];

    const outputFilePath = `${process.cwd()}/temp/${crypto.randomUUID()}.${fileType}`;

    await runFFmpeg(tempFilePath, outputFilePath);

    res.status(StatusCodes.OK).sendFile(outputFilePath);

    res.on("finish", () => {
      fs.unlink(outputFilePath, (err) => {});
      fs.unlink(tempFilePath, (err) => {});
    });
  } catch (error: any) {
    logger.error(error, `compressVideoHandler: error compression video failed`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error?.message || "");
  }
}
