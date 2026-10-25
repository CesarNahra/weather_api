import { AppError } from "../utils/app-error.js";

export function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message
            }
        });
    }

    console.error("An unexpected application error occurred.");

    return response.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred."
        }
    });
}