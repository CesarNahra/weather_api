import { AppError } from "../utils/app-error.js";
import { weatherProvider } from "../providers/weather.provider.js";

function ensureObject(value, errorMessage) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new AppError(
            errorMessage,
            502,
            "INVALID_WEATHER_PROVIDER_RESPONSE"
        );
    }

    return value;
}

function getTemperature(value, units) {
    return units === "imperial" ? value.temp_f : value.temp_c;
}

function getFeelsLikeTemperature(value, units) {
    return units === "imperial"
        ? value.feelslike_f
        : value.feelslike_c;
}

function getWindSpeed(value, units) {
    return units === "imperial" ? value.wind_mph : value.wind_kph;
}

function getPressure(value, units) {
    return units === "imperial" ? value.pressure_in : value.pressure_mb;
}

function getPrecipitation(value, units) {
    return units === "imperial" ? value.precip_in : value.precip_mm;
}

function getVisibility(value, units) {
    return units === "imperial" ? value.vis_miles : value.vis_km;
}

function getLocation(location) {
    ensureObject(
        location,
        "The weather provider returned incomplete location data."
    );

    return {
        name: location.name,
        region: location.region,
        country: location.country,
        local_time: location.localtime
    };
}

export class WeatherService {
    constructor(provider = weatherProvider) {
        this.provider = provider;
    }

    async getCurrentWeather({ location, units = "metric", lang }) {
        const data = ensureObject(
            await this.provider.getCurrentWeather({ location, lang }),
            "The weather provider returned invalid current weather data."
        );

        ensureObject(
            data.current,
            "The weather provider returned incomplete current weather data."
        );

        ensureObject(
            data.location,
            "The weather provider returned incomplete location data."
        );

        const current = data.current;

        return {
            location: getLocation(data.location),
            current: {
                temperature: getTemperature(current, units),
                feels_like: getFeelsLikeTemperature(current, units),
                condition: current.condition?.text,
                humidity: current.humidity,
                wind_speed: getWindSpeed(current, units),
                pressure: getPressure(current, units),
                precipitation: getPrecipitation(current, units),
                visibility: getVisibility(current, units),
                uv_index: current.uv,
                last_updated: current.last_updated
            },
            units
        };
    }

    async getForecast({
        location,
        days = 3,
        units = "metric",
        lang
    }) {
        const data = ensureObject(
            await this.provider.getForecast({
                location,
                days,
                lang
            }),
            "The weather provider returned invalid forecast data."
        );

        ensureObject(
            data.location,
            "The weather provider returned incomplete location data."
        );

        ensureObject(
            data.forecast,
            "The weather provider returned incomplete forecast data."
        );

        if (!Array.isArray(data.forecast.forecastday)) {
            throw new AppError(
                "The weather provider returned invalid daily forecast data.",
                502,
                "INVALID_WEATHER_PROVIDER_RESPONSE"
            );
        }

        const forecast = data.forecast.forecastday.map((day) => {
            ensureObject(
                day,
                "The weather provider returned an invalid forecast day."
            );

            ensureObject(
                day.day,
                "The weather provider returned incomplete daily weather data."
            );

            const daily = day.day;

            return {
                date: day.date,
                temperature: {
                    maximum: units === "imperial"
                        ? daily.maxtemp_f
                        : daily.maxtemp_c,
                    minimum: units === "imperial"
                        ? daily.mintemp_f
                        : daily.mintemp_c,
                    average: units === "imperial"
                        ? daily.avgtemp_f
                        : daily.avgtemp_c
                },
                condition: daily.condition?.text,
                wind_speed: units === "imperial"
                    ? daily.maxwind_mph
                    : daily.maxwind_kph,
                precipitation: units === "imperial"
                    ? daily.totalprecip_in
                    : daily.totalprecip_mm,
                humidity: daily.avghumidity,
                chance_of_rain: daily.daily_chance_of_rain,
                uv_index: daily.uv
            };
        });

        return {
            location: getLocation(data.location),
            forecast,
            units
        };
    }

    async searchLocations({ query }) {
        const data = await this.provider.searchLocations({ query });

        if (!Array.isArray(data)) {
            throw new AppError(
                "The weather provider returned invalid location search data.",
                502,
                "INVALID_WEATHER_PROVIDER_RESPONSE"
            );
        }

        return {
            results: data.map((location) => {
                ensureObject(
                    location,
                    "The weather provider returned an invalid location."
                );

                return {
                    name: location.name,
                    region: location.region,
                    country: location.country,
                    latitude: location.lat,
                    longitude: location.lon
                };
            })
        };
    }
}

export const weatherService = new WeatherService();