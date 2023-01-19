import { spawn } from "child_process";
import logger from "../../utils/logger";
// ("-i input.mp4 -vcodec libx265 -crf 28 output.mp4");
function runFFmpeg(
  input: string,
  output: string,
  width: string,
  height: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(require("@ffmpeg-installer/ffmpeg").path, [
      "-i",
      input,
      "-vf",
      `scale=${width}:${height}`,
      "-vcodec",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "18",
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
