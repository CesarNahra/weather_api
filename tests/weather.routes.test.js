import test from "node:test";
import assert from "node:assert/strict";

import app from "../src/app.js";

async function withServer(callback) {
    const server = app.listen(0);

    try {
        await new Promise((resolve, reject) => {
            server.once("listening", resolve);
            server.once("error", reject);
        });

        const address = server.address();
        const baseUrl = `http://127.0.0.1:${address.port}`;

        await callback(baseUrl);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

test("health endpoint should return 200", async () => {
    await withServer(async (baseUrl) => {
        const res = await fetch(
            `${baseUrl}/api/v1/health`
        );

        const body = await res.json();

        assert.equal(res.status, 200);
        assert.equal(body.status, "ok");
    });
});

test("current weather endpoint should reject a missing location", async () => {
    await withServer(async (baseUrl) => {
        const res = await fetch(
            `${baseUrl}/api/v1/weather/current`
        );

        const body = await res.json();

        assert.equal(res.status, 400);
        assert.equal(body.error.code, "MISSING_LOCATION");
    });
});

test("forecast endpoint should reject an invalid number of days", async () => {
    await withServer(async (baseUrl) => {
        const res = await fetch(
            `${baseUrl}/api/v1/weather/forecast?location=London&days=100`
        );

        const body = await res.json();

        assert.equal(res.status, 400);
        assert.equal(body.error.code, "INVALID_FORECAST_DAYS");
    });
});

test("search endpoint should reject a missing query", async () => {
    await withServer(async (baseUrl) => {
        const res = await fetch(
            `${baseUrl}/api/v1/weather/search`
        );

        const body = await res.json();

        assert.equal(res.status, 400);
        assert.equal(body.error.code, "MISSING_SEARCH_QUERY");
    });
});