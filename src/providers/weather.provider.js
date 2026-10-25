import { environment } from "../config/environment.js";
import { AppError } from "../utils/app-error.js";

export class WeatherProvider {
    constructor(config = environment, fetchImplementation = fetch) {
        this.config = config;
        this.fetchImplementation = fetchImplementation;
    }

    async request(endpoint, parameters) {
        if (!this.config.weatherApiKey) {
            throw new AppError(
                "The weather provider is not configured.",
                503,
                "WEATHER_PROVIDER_NOT_CONFIGURED"
            );
        }

        const baseUrl = this.config.weatherApiBaseUrl.replace(/\/+$/, "");
        const url = new URL(`${baseUrl}/${endpoint}`);

        url.searchParams.set("key", this.config.weatherApiKey);

        for (const [name, value] of Object.entries(parameters)) {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(name, String(value));
            }
        }

        let response;

        try {
            response = await this.fetchImplementation(url, {
                signal: AbortSignal.timeout(
                    this.config.weatherApiTimeoutMs
                )
            });
        } catch (error) {
            if (
                error.name === "TimeoutError" ||
                error.name === "AbortError"
            ) {
                throw new AppError(
                    "The weather provider request timed out.",
                    504,
                    "WEATHER_PROVIDER_TIMEOUT"
                );
            }

            throw new AppError(
                "The weather provider could not be reached.",
                502,
                "WEATHER_PROVIDER_UNAVAILABLE"
            );
        }

        let data;

        try {
            data = await response.json();
        } catch {
            throw new AppError(
                "The weather provider returned an invalid response.",
                502,
                "INVALID_WEATHER_PROVIDER_RESPONSE"
            );
        }

        if (!response.ok || data.error) {
            const providerErrorCode = data.error?.code;

            if (providerErrorCode === 1006) {
                throw new AppError(
                    "No matching location was found.",
                    404,
                    "LOCATION_NOT_FOUND"
                );
            }

            if (providerErrorCode === 2007) {
                throw new AppError(
                    "The weather provider is temporarily unavailable.",
                    503,
                    "WEATHER_PROVIDER_QUOTA_EXCEEDED"
                );
            }

            throw new AppError(
                "The weather provider could not process the request.",
                502,
                "WEATHER_PROVIDER_ERROR"
            );
        }

        return data;
    }

    async getCurrentWeather({ location, lang }) {
        return this.request("current.json", {
            q: location,
            lang
        });
    }

    async getForecast({ location, days, lang }) {
        return this.request("forecast.json", {
            q: location,
            days,
            lang
        });
    }

    async searchLocations({ query }) {
        return this.request("search.json", {
            q: query
        });
    }
}

export const weatherProvider = new WeatherProvider();