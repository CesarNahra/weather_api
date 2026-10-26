import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/utils/app-error.js";
import { errorHandler } from "../src/middleware/error.middleware.js";

function createResponse() {
    return {
        statusCode: null,
        body: null,

        status(statusCode) {
            this.statusCode = statusCode;
            return this;
        },

        json(body) {
            this.body = body;
            return this;
        }
    };
}

test("error handler should return the status and details of an AppError", () => {
    const response = createResponse();
    const error = new AppError(
        "The location parameter is required.",
        400,
        "MISSING_LOCATION"
    );

    errorHandler(error, {}, response, () => {});

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, {
        error: {
            code: "MISSING_LOCATION",
            message: "The location parameter is required."
        }
    });
});

test("error handler should hide unexpected error details", () => {
    const response = createResponse();
    const error = new Error("Sensitive internal implementation details");

    const originalConsoleError = console.error;
    console.error = () => {};

    try {
        errorHandler(error, {}, response, () => {});

        assert.equal(response.statusCode, 500);
        assert.deepEqual(response.body, {
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred."
            }
        });
    } finally {
        console.error = originalConsoleError;
    }
});