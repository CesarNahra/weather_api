import { AppError } from "../utils/app-error.js";

const SUPPORTED_UNITS = ["metric", "imperial"];

const MIN_FORECAST_DAYS = 1;
const MAX_FORECAST_DAYS = 3;

export function validateLocation(location) {
    if (typeof location !== "string" || !location.trim()) {
        throw new AppError(
            "The location parameter is required.",
            400,
            "MISSING_LOCATION"
        );
    }

    return location.trim();
}

export function validateUnits(units = "metric") {
    if (!SUPPORTED_UNITS.includes(units)) {
        throw new AppError(
            "The units parameter must be metric or imperial.",
            400,
            "INVALID_UNITS"
        );
    }

    return units;
}

export function validateForecastDays(days = "3") {
    const parsedDays = Number(days);

    if (
        !Number.isInteger(parsedDays) ||
        parsedDays < MIN_FORECAST_DAYS ||
        parsedDays > MAX_FORECAST_DAYS
    ) {
        throw new AppError(
            `The days parameter must be an integer between ${MIN_FORECAST_DAYS} and ${MAX_FORECAST_DAYS}.`,
            400,
            "INVALID_FORECAST_DAYS"
        );
    }

    return parsedDays;
}

export function validateSearchQuery(query) {
    if (typeof query !== "string" || !query.trim()) {
        throw new AppError(
            "The query parameter is required.",
            400,
            "MISSING_SEARCH_QUERY"
        );
    }

    return query.trim();
}

export function validateCurrentWeatherRequest(req, res, next) {
    try {
        res.locals.weatherQuery = {
            location: validateLocation(req.query.location),
            units: validateUnits(req.query.units)
        };

        next();
    } catch (error) {
        next(error);
    }
}

export function validateForecastRequest(req, res, next) {
    try {
        res.locals.weatherQuery = {
            location: validateLocation(req.query.location),
            days: validateForecastDays(req.query.days),
            units: validateUnits(req.query.units)
        };

        next();
    } catch (error) {
        next(error);
    }
}

export function validateSearchRequest(req, res, next) {
    try {
        res.locals.weatherQuery = {
            query: validateSearchQuery(req.query.query)
        };

        next();
    } catch (error) {
        next(error);
    }
}