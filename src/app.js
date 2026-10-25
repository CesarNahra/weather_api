import express from "express";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes.js";
import weatherRoutes from "./routes/weather.routes.js";

import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/weather", weatherRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;