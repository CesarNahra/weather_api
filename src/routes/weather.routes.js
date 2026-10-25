import { Router } from "express";

import { weatherController } from "../controllers/weather.controller.js";

import {
    validateCurrentWeatherRequest,
    validateForecastRequest,
    validateSearchRequest
} from "../validators/weather.validator.js";

const router = Router();

router.get(
    "/current",
    validateCurrentWeatherRequest,
    weatherController.getCurrentWeather
);

router.get(
    "/forecast",
    validateForecastRequest,
    weatherController.getForecast
);

router.get(
    "/search",
    validateSearchRequest,
    weatherController.searchLocations
);

export default router;