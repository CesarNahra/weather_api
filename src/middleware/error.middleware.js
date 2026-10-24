export function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;

    const errorCode =
        statusCode >= 500
            ? "INTERNAL_SERVER_ERROR"
            : "REQUEST_ERROR";

    const message =
        statusCode >= 500
            ? "An unexpected error occurred."
            : error.message;

    if (statusCode >= 500) {
        console.error("An unexpected application error occurred.");
    }

    res.status(statusCode).json({
        error: {
            code: errorCode,
            message
        }
    });
}