import express from "express";
import cors from "cors";
import routes from "./routes";
import { config } from "./config/app";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(config.port, () => {
  logger.info(`${config.appName} started on port ${config.port}`);
});