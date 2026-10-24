export function notFoundHandler(req, res, next) {
    res.status(404).json({
        error: {
            code: "ROUTE_NOT_FOUND",
            message: "The requested resource was not found."
        }
    });
}