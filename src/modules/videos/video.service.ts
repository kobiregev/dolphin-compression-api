import fs from "fs/promises";
import logger from "../../utils/logger";

export async function deleteFiles(...filesPaths: string[]): Promise<void> {
  return new Promise((resolve, _) => {
    filesPaths.forEach((path) =>
      fs
        .unlink(path)
        .then(() => resolve())
        .catch((e) => logger.error(e, `Error deleting file at: ${path}`))
    );
  });
}
