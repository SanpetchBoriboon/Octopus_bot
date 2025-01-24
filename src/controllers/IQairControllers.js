const { aqiCategory } = require('../aqi-category');
const { format } = require('date-fns');
const IQAirServices = require('../services/IQairServices');

class AirQualityController {
    constructor() {}

    // Helper function to get AQI category details
    _getAQICategory(aqius) {
        const aqiQuality = aqiCategory.find((category) => {
            return aqius <= category.thresholdLevel;
        });

        let { description, emoji, flag, level } = aqiQuality;
        return { description, emoji, flag, level };
    }

    async callAirQualityByLatLong(latitude, longitude) {
        try {
            const iqAirServices = new IQAirServices();
            const { data } = await iqAirServices.getAirQualityByLatLong(
                latitude,
                longitude
            );
            const { city, state, country, current } = data;

            // Check if the data exists
            if (!city || !state || !country || !current) {
                throw new Error('Incomplete data received from AirVisual API');
            }

            const { weather, pollution } = current;
            const { tp, pr, hu, ws, wd } = weather;
            const { aqius } = pollution;

            // Get AQI category details
            const { description, emoji, flag, level } =
                this._getAQICategory(aqius);

            // Define the date format
            const DATE_FORMAT = 'dd MMM yyyy hh:mm aaaa';
            // Format the data into a message
            const location = `<a><b>${city}, ${state}, ${country}</b> 📍 </a>`;
            const time = `<a>Date Time: <b>${format(new Date(), DATE_FORMAT)}</b></a>`;
            const weatherData = `<a>Temperature: <b>${tp}°C</b></a>`;
            const pollutionData = `<a>AQI: <b>${aqius}</b></a>`;
            const advice = `<a><b><i>${level}</i></b> ${description} ${emoji}</a>`;

            // Construct the final message text
            const messageText = `${location}\n${time}\n${weatherData}\n${pollutionData} ${flag}\n\n${advice}`;

            return { messageText };
        } catch (error) {
            console.error('Error fetching air quality data:', error);
            return {
                messageText:
                    'Unable to fetch air quality data. Please try again later.',
            };
        }
    }
}

module.exports = AirQualityController;
