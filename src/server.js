import app from "./app.js";
import { environment } from "./config/environment.js";

const server = app.listen(environment.port, () => {
    console.log(
        `Weather API running on port ${environment.port}.`
    );
    console.log(
        `Environment: ${environment.nodeEnvironment}.`
    );
});

function shutdown() {
    console.log("Shutting down the server.");

    server.close((error) => {
        if (error) {
            console.error("Failed to close the server.");
            process.exit(1);
        }

        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);