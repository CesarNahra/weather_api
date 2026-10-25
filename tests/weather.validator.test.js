import test from "node:test";
import assert from "node:assert/strict";

import {
    validateLocation,
    validateUnits,
    validateForecastDays,
    validateSearchQuery
} from "../src/validators/weather.validator.js";

import { AppError } from "../src/utils/app-error.js";

test("validateLocation should trim whitespace", () => {
    assert.equal(validateLocation(" London "), "London");
});

test("validateLocation should reject an empty location", () => {
    assert.throws(
        () => validateLocation("   "),
        {
            name: "AppError",
            code: "MISSING_LOCATION",
            statusCode: 400
        }
    );
});

test("validateUnits should default to metric", () => {
    assert.equal(validateUnits(), "metric");
});

test("validateUnits should accept imperial", () => {
    assert.equal(validateUnits("imperial"), "imperial");
});

test("validateUnits should reject unsupported units", () => {
    assert.throws(
        () => validateUnits("kelvin"),
        {
            name: "AppError",
            code: "INVALID_UNITS",
            statusCode: 400
        }
    );
});

test("validateForecastDays should default to three days", () => {
    assert.equal(validateForecastDays(), 3);
});

test("validateForecastDays should accept valid integer values", () => {
    assert.equal(validateForecastDays("1"), 1);
    assert.equal(validateForecastDays("2"), 2);
    assert.equal(validateForecastDays("3"), 3);
});

test("validateForecastDays should reject values outside the allowed range", () => {
    assert.throws(
        () => validateForecastDays("100"),
        {
            name: "AppError",
            code: "INVALID_FORECAST_DAYS",
            statusCode: 400
        }
    );
});

test("validateForecastDays should reject non-integer values", () => {
    assert.throws(
        () => validateForecastDays("1.5"),
        {
            name: "AppError",
            code: "INVALID_FORECAST_DAYS",
            statusCode: 400
        }
    );
});

test("validateSearchQuery should trim whitespace", () => {
    assert.equal(validateSearchQuery(" London "), "London");
});

test("validateSearchQuery should reject an empty query", () => {
    assert.throws(
        () => validateSearchQuery(""),
        {
            name: "AppError",
            code: "MISSING_SEARCH_QUERY",
            statusCode: 400
        }
    );
});