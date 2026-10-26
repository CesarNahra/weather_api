# Weather API

A RESTful weather API built with Node.js and Express. It provides current weather conditions, weather forecasts, and location search through the WeatherAPI service.

The project focuses on clean architecture, separation of concerns, input validation, centralized error handling, automated testing, and API documentation.

## Features

- Retrieve current weather conditions.
- Retrieve weather forecasts for 1 to 3 days.
- Search for locations.
- Support metric and imperial measurement systems.
- Support language selection for weather descriptions.
- Validate request parameters.
- Handle upstream API errors and timeouts.
- Provide interactive API documentation with Swagger UI.
- Run automated tests using the built-in Node.js test runner.

## Tech Stack

- Node.js
- Express
- WeatherAPI
- Native Fetch API
- dotenv
- Helmet
- OpenAPI 3.0
- Swagger UI Express
- YAML
- Node.js built-in test runner

## Architecture

The application separates responsibilities into dedicated layers:

- **Routes:** Define the API endpoints.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Apply application logic and normalize provider data.
- **Providers:** Communicate with the external weather service.
- **Validators:** Validate incoming request parameters.
- **Middleware:** Handle errors and unmatched routes.
- **Configuration:** Load and validate environment variables.

This structure helps keep the code modular, testable, and easier to maintain.

## Requirements

- Node.js LTS
- npm
- A WeatherAPI API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/CesarNahra/weather_api.git
cd weather-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```dotenv
PORT=3000
NODE_ENV=development
WEATHER_API_KEY=your_weather_api_key
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1
WEATHER_API_TIMEOUT_MS=5000
```

Replace `your_weather_api_key` with your WeatherAPI key.

Never commit your actual `.env` file or expose your API key in source code.

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

`http://localhost:3000`

### 5. Start the production server

```bash
npm start
```

## API Documentation

Interactive API documentation is available through Swagger UI:

`http://localhost:3000/api-docs`

The OpenAPI specification is maintained in `openapi.yaml`.

## Endpoints

All application endpoints use the `/api/v1` prefix.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Check API health |
| GET | `/api/v1/weather/current` | Retrieve current weather |
| GET | `/api/v1/weather/forecast` | Retrieve a weather forecast |
| GET | `/api/v1/weather/search` | Search for locations |

### Current Weather

Retrieve current weather conditions for a location.

```http
GET /api/v1/weather/current?location=London
```

Optional parameters:

| Parameter | Accepted values | Default |
|---|---|---|
| `units` | `metric`, `imperial` | `metric` |
| `lang` | A language code supported by the provider | Provider default |

Example:

```http
GET /api/v1/weather/current?location=London&units=metric&lang=en
```

### Weather Forecast

Retrieve a forecast for a location.

```http
GET /api/v1/weather/forecast?location=London&days=3
```

Optional parameters:

| Parameter | Accepted values | Default |
|---|---|---|
| `days` | Integer from 1 to 3 | Verify the implementation |
| `units` | `metric`, `imperial` | `metric` |
| `lang` | A language code supported by the provider | Provider default |

### Location Search

Search for matching locations.

```http
GET /api/v1/weather/search?query=London
```

## Error Handling

The API uses a consistent JSON structure for errors.

Example:

```json
{
  "error": {
    "code": "MISSING_LOCATION",
    "message": "The location parameter is required."
  }
}
```

Common HTTP status codes include:

| Status | Description |
|---|---|
| `400` | Invalid or missing request parameters |
| `404` | Requested location or route not found |
| `500` | Unexpected internal server error |
| `502` | Error communicating with the weather provider |
| `503` | Provider configuration or availability issue |
| `504` | Weather provider request timed out |

The exact error code and message depend on the failure.

## Testing

Run the automated test suite:

```bash
npm test
```

The tests cover provider behavior, service logic, request validation, and error handling.

Provider interactions should be tested using mocked responses so that the test suite does not depend on a live weather service or a real API key.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | HTTP server port |
| `NODE_ENV` | Application environment |
| `WEATHER_API_KEY` | WeatherAPI access key |
| `WEATHER_API_BASE_URL` | WeatherAPI base URL |
| `WEATHER_API_TIMEOUT_MS` | Maximum duration for a provider request |

See `.env.example` for the expected configuration.

## Security Considerations

- Keep API keys in environment variables.
- Do not commit secrets to version control.
- Validate external input before processing requests.
- Avoid exposing internal error details in HTTP responses.
- Use Helmet to configure security-related HTTP headers.
- Apply timeouts to external API requests.

## Future Improvements

Potential improvements include:

- More comprehensive automated tests.
- More detailed OpenAPI response schemas.
- Request rate limiting.
- Caching frequently requested weather data.
- Structured logging.
- Continuous integration with GitHub Actions.

## License

No license has been specified yet. Add a `LICENSE` file before distributing the project under an open-source license.