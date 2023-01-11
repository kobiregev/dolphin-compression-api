import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import videoRoute from "./modules/videos/video.route";
import helmet from "helmet";
import fileUpload from "express-fileupload";

const signals = ["SIGTERM", "SIGINT"];
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    tempFileDir: "temp",
    useTempFiles: true,
  })
);

app.use("/api/videos", videoRoute);

const server = app.listen(PORT, () => {
  logger.info(`Server listening at http://localhost:${PORT}`);
});

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    logger.info(`Goodbye, got signal ${signal}`);
    server.close();

    process.exit(0);
  });
}

signals.forEach((signal) => {
  gracefulShutdown(signal);
});
