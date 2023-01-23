import { filesize } from "filesize";
import fs from "fs/promises";
import logger from "../utils/logger";

export async function deleteFiles(...filesPaths: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    filesPaths.forEach((path) =>
      fs
        .unlink(path)
        .then(() => resolve())
        .catch((e) => {
          logger.error(e, `Error deleting file at: ${path}`);
          reject(e);
        })
    );
  });
}

export async function getFileSize(filePath: string): Promise<any> {
  try {
    const videoStats = await fs.stat(filePath);
    const fileSize = filesize(videoStats.size, {
      base: 2,
      standard: "jedec",
    }).toString();

    return [fileSize, null];
  } catch (error) {
    return [null, error];
  }
}
