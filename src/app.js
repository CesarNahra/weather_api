import express from "express";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

import healthRoutes from "./routes/health.routes.js";
import weatherRoutes from "./routes/weather.routes.js";

import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { fileURLToPath } from "url";

const app = express();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const openApiFilePath = path.resolve(currentDirectory, "../openapi.yaml");
const openApiDocument = YAML.parse(fs.readFileSync(openApiFilePath, "utf8"));

app.disable("x-powered-by");

app.use(helmet());
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;