import { spawn } from "child_process";
import Queue from "bull";

function runFFmpeg(input: string, output: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(require("@ffmpeg-installer/ffmpeg").path, [
      "-i",
      input,
      "-vf",
      "scale=640:480",
      "-preset",
      "slow",
      "-crf",
      "28",
      output,
    ]);
    let outputData = "";

    ffmpeg.stdout.on("data", (data: Buffer) => {
      outputData += data.toString();
    });

    ffmpeg.stderr.on("error", (data: Buffer) => {
      console.log(data.toString());
      reject(data.toString());
    });

    ffmpeg.on("close", (code: number) => {
      if (code === 0) {
        resolve(outputData);
      } else {
        reject(`child process exited with code ${code}`);
      }
    });
  });
}

export { runFFmpeg };

/*
export function runFFmpeg(input: string, output: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(require("@ffmpeg-installer/ffmpeg").path, [
      "-i",
      input,
      "-vf",
      "scale=640:480",
      "-preset",
      "slow",
      "-crf",
      "28",
      output,
    ]);
    let outputData = "";

    ffmpeg.stdout.on("data", (data: Buffer) => {
      outputData += data.toString();
    });

    ffmpeg.stderr.on("error", (data: Buffer) => {
      console.log(data.toString());
      reject(data.toString());
    });

    ffmpeg.on("close", (code: number) => {
      if (code === 0) {
        resolve(outputData);
      } else {
        reject(`child process exited with code ${code}`);
      }
    });
  });
}

*/
