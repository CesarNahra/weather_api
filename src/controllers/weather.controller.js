import { weatherService } from "../services/weather.service.js";

export class WeatherController {
    constructor(service = weatherService) {
        this.service = service;

        this.getCurrentWeather = this.getCurrentWeather.bind(this);
        this.getForecast = this.getForecast.bind(this);
        this.searchLocations = this.searchLocations.bind(this);
    }

    async getCurrentWeather(req, res, next) {
        try {
            const result = await this.service.getCurrentWeather(
                res.locals.weatherQuery
            );

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }

    async getForecast(req, res, next) {
        try {
            const result = await this.service.getForecast(
                res.locals.weatherQuery
            );

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }

    async searchLocations(req, res, next) {
        try {
            const result = await this.service.searchLocations(
                res.locals.weatherQuery
            );

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }
}

export const weatherController = new WeatherController();