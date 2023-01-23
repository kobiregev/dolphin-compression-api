import { spawn } from "child_process";
import logger from "../utils/logger";

function runFFmpeg({
  input,
  output,

  ffmpegCommands,
}: {
  input: string;
  output: string;
  ffmpegCommands: string[];
}): Promise<string> {
  return new Promise((resolve, reject) => {
    // Default commands
    const inputCommand = ["-i", input];

    const ffmpeg = spawn(require("@ffmpeg-installer/ffmpeg").path, [
      ...inputCommand,
      ...ffmpegCommands,
      output,
    ]);

    let outputData = "";

    ffmpeg.stdout.on("data", (data: Buffer) => {
      outputData += data.toString();
    });

    ffmpeg.stderr.on("error", (data: Buffer) => {
      reject(data.toString());
    });

    ffmpeg.on("close", (code: number) => {
      logger.info("Finished compression");
      if (code === 0) {
        resolve(outputData);
      } else {
        reject(`child process exited with code ${code}`);
      }
    });
  });
}

export { runFFmpeg };
