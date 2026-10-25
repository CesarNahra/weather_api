import test from "node:test";
import assert from "node:assert/strict";

import { WeatherProvider } from "../src/providers/weather.provider.js";

function createProvider(fetchImplementation) {
    const config = {
        weatherApiKey: "test-api-key",
        weatherApiBaseUrl: "https://api.weatherapi.com/v1",
        weatherApiTimeoutMs: 5000
    };

    return new WeatherProvider(config, fetchImplementation);
}

test("getCurrentWeather should request current weather data", async () => {
    let requestedUrl;

    const mockFetch = async (url) => {
        requestedUrl = new URL(url);

        return {
            ok: true,
            json: async () => ({
                location: {
                    name: "London"
                },
                current: {
                    temp_c: 18
                }
            })
        };
    };

    const provider = createProvider(mockFetch);

    const result = await provider.getCurrentWeather({
        location: "London"
    });

    assert.equal(
        requestedUrl.pathname,
        "/v1/current.json"
    );

    assert.equal(
        requestedUrl.searchParams.get("key"),
        "test-api-key"
    );

    assert.equal(
        requestedUrl.searchParams.get("q"),
        "London"
    );

    assert.equal(result.current.temp_c, 18);
});

test("getForecast should include the requested number of days", async () => {
    let requestedUrl;

    const mockFetch = async (url) => {
        requestedUrl = new URL(url);

        return {
            ok: true,
            json: async () => ({
                forecast: {
                    forecastday: []
                }
            })
        };
    };

    const provider = createProvider(mockFetch);

    await provider.getForecast({
        location: "London",
        days: 3
    });

    assert.equal(
        requestedUrl.pathname,
        "/v1/forecast.json"
    );

    assert.equal(
        requestedUrl.searchParams.get("days"),
        "3"
    );
});

test("searchLocations should use the search endpoint", async () => {
    let requestedUrl;

    const mockFetch = async (url) => {
        requestedUrl = new URL(url);

        return {
            ok: true,
            json: async () => ([
                {
                    name: "London",
                    country: "United Kingdom"
                }
            ])
        };
    };

    const provider = createProvider(mockFetch);

    const result = await provider.searchLocations({
        query: "London"
    });

    assert.equal(
        requestedUrl.pathname,
        "/v1/search.json"
    );

    assert.equal(
        requestedUrl.searchParams.get("q"),
        "London"
    );

    assert.equal(result[0].name, "London");
});

test("provider should reject requests without an API key", async () => {
    const config = {
        weatherApiKey: "",
        weatherApiBaseUrl: "https://api.weatherapi.com/v1",
        weatherApiTimeoutMs: 5000
    };

    const provider = new WeatherProvider(config);

    await assert.rejects(
        () => provider.getCurrentWeather({
            location: "London"
        }),
        {
            code: "WEATHER_PROVIDER_NOT_CONFIGURED",
            statusCode: 503
        }
    );
});

test("provider should map unknown locations to a 404 error", async () => {
    const mockFetch = async () => ({
        ok: false,
        json: async () => ({
            error: {
                code: 1006,
                message: "No matching location found."
            }
        })
    });

    const provider = createProvider(mockFetch);

    await assert.rejects(
        () => provider.getCurrentWeather({
            location: "UnknownLocation"
        }),
        {
            code: "LOCATION_NOT_FOUND",
            statusCode: 404
        }
    );
});