type getCommandArgs = {
  width: string;
  height: string;
  compression: string;
  fileType: string;
};
export function getCommand({
  width,
  height,
  compression,
  fileType,
}: getCommandArgs) {
  switch (fileType) {
    case "mp4":
      return [
        "-vf",
        `scale=${width}:${height}`,
        "-vcodec",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        compression,
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-aspect",
        "1",
      ];
    case "gif":
      return [
        "-vf",
        `fps=10,scale=${width}:${height}:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
      ];
  }
  return [];
}
