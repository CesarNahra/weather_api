import dotenv from "dotenv";

dotenv.config();

function getPositiveInteger(value, defaultValue, variableName) {
    if (value === undefined || value === "") {
        return defaultValue;
    }

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new Error(
            `${variableName} must be a positive integer.`
        );
    }

    return parsedValue;
}

const port = getPositiveInteger(
    process.env.PORT,
    3000,
    "PORT"
);

const timeout = getPositiveInteger(
    process.env.WEATHER_API_TIMEOUT_MS,
    5000,
    "WEATHER_API_TIMEOUT_MS"
);

const nodeEnvironment = process.env.NODE_ENV || "development";

const allowedEnvironments = [
    "development",
    "production",
    "test"
];

if (!allowedEnvironments.includes(nodeEnvironment)) {
    throw new Error(
        "NODE_ENV must be development, production, or test."
    );
}

const weatherApiBaseUrl =
    process.env.WEATHER_API_BASE_URL ||
    "https://api.weatherapi.com/v1";

export const environment = Object.freeze({
    port,
    nodeEnvironment,
    weatherApiKey: process.env.WEATHER_API_KEY || "",
    weatherApiBaseUrl,
    weatherApiTimeoutMs: timeout
});