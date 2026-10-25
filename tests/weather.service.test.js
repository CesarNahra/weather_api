import test from "node:test";
import assert from "node:assert/strict";

import { WeatherService } from "../src/services/weather.service.js";

function createMockProvider() {
    return {
        getCurrentWeather: async () => ({
            location: {
                name: "London",
                region: "City of London, Greater London",
                country: "United Kingdom",
                localtime: "2026-10-25 12:00"
            },
            current: {
                temp_c: 15,
                temp_f: 59,
                feelslike_c: 14,
                feelslike_f: 57.2,
                condition: {
                    text: "Partly cloudy"
                },
                humidity: 72,
                wind_kph: 12.6,
                wind_mph: 7.8,
                pressure_mb: 1012,
                pressure_in: 29.88,
                precip_mm: 0.2,
                precip_in: 0.01,
                vis_km: 10,
                vis_miles: 6,
                uv: 2,
                last_updated: "2026-10-25 11:45"
            }
        }),

        getForecast: async () => ({
            location: {
                name: "London",
                region: "City of London, Greater London",
                country: "United Kingdom",
                localtime: "2026-10-25 12:00"
            },
            forecast: {
                forecastday: [
                    {
                        date: "2026-10-25",
                        day: {
                            maxtemp_c: 17,
                            maxtemp_f: 62.6,
                            mintemp_c: 10,
                            mintemp_f: 50,
                            avgtemp_c: 13.5,
                            avgtemp_f: 56.3,
                            condition: {
                                text: "Partly cloudy"
                            },
                            maxwind_kph: 20,
                            maxwind_mph: 12.4,
                            totalprecip_mm: 1.5,
                            totalprecip_in: 0.06,
                            avghumidity: 70,
                            daily_chance_of_rain: 30,
                            uv: 3
                        }
                    }
                ]
            }
        }),

        searchLocations: async () => [
            {
                name: "London",
                region: "City of London, Greater London",
                country: "United Kingdom",
                lat: 51.52,
                lon: -0.11
            }
        ]
    };
}

test("getCurrentWeather should return metric values by default", async () => {
    const service = new WeatherService(createMockProvider());

    const result = await service.getCurrentWeather({
        location: "London"
    });

    assert.equal(result.units, "metric");
    assert.equal(result.current.temperature, 15);
    assert.equal(result.current.feels_like, 14);
    assert.equal(result.current.wind_speed, 12.6);
    assert.equal(result.current.pressure, 1012);
    assert.equal(result.current.precipitation, 0.2);
    assert.equal(result.current.visibility, 10);
});

test("getCurrentWeather should return imperial values when requested", async () => {
    const service = new WeatherService(createMockProvider());

    const result = await service.getCurrentWeather({
        location: "London",
        units: "imperial"
    });

    assert.equal(result.units, "imperial");
    assert.equal(result.current.temperature, 59);
    assert.equal(result.current.feels_like, 57.2);
    assert.equal(result.current.wind_speed, 7.8);
    assert.equal(result.current.pressure, 29.88);
    assert.equal(result.current.precipitation, 0.01);
    assert.equal(result.current.visibility, 6);
});

test("getForecast should return daily forecast data", async () => {
    const service = new WeatherService(createMockProvider());

    const result = await service.getForecast({
        location: "London",
        days: 1
    });

    assert.equal(result.units, "metric");
    assert.equal(result.forecast.length, 1);
    assert.equal(result.forecast[0].date, "2026-10-25");
    assert.equal(result.forecast[0].temperature.maximum, 17);
    assert.equal(result.forecast[0].temperature.minimum, 10);
    assert.equal(result.forecast[0].precipitation, 1.5);
});

test("getForecast should return imperial values when requested", async () => {
    const service = new WeatherService(createMockProvider());

    const result = await service.getForecast({
        location: "London",
        days: 1,
        units: "imperial"
    });

    assert.equal(result.forecast[0].temperature.maximum, 62.6);
    assert.equal(result.forecast[0].temperature.minimum, 50);
    assert.equal(result.forecast[0].wind_speed, 12.4);
});

test("searchLocations should normalize location results", async () => {
    const service = new WeatherService(createMockProvider());

    const result = await service.searchLocations({
        query: "London"
    });

    assert.equal(result.results.length, 1);
    assert.equal(result.results[0].name, "London");
    assert.equal(result.results[0].latitude, 51.52);
    assert.equal(result.results[0].longitude, -0.11);
});

test("getCurrentWeather should reject an incomplete provider response", async () => {
    const provider = {
        getCurrentWeather: async () => ({
            location: {
                name: "London"
            }
        })
    };

    const service = new WeatherService(provider);

    await assert.rejects(
        () => service.getCurrentWeather({
            location: "London"
        }),
        {
            code: "INVALID_WEATHER_PROVIDER_RESPONSE",
            statusCode: 502
        }
    );
});