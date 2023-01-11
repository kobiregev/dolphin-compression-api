import fs from "fs";
import { StatusCodes } from "http-status-codes";
import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(path);

process.on("message", (payload: { tempFilePath: string; name: string }) => {
  const { tempFilePath, name } = payload;
  const endProcess = (endPayload: any) => {
    const { statusCode, text } = endPayload;
    console.log({ endPayload });

    fs.unlink(tempFilePath, (err) => {
      if (err) {
        process.send?.({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          text: err.message,
        });
      }
    });
    // Format response so it fits the api response
    process.send?.({ statusCode, text });
    // End process
    process.exit();
  };

  // Process video and send back the result
  ffmpeg(tempFilePath)
    .fps(30)
    .addOptions(["-crf 28"])
    .on("end", () => {
      endProcess({ statusCode: StatusCodes.OK, text: "Success" });
    })
    .on("error", (err) => {
      endProcess({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        text: err.message,
      });
    })
    .save(`./temp/${name}`);
});
