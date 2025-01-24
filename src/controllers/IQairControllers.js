const { iqairCategory } = require('../iqairCategory.json');
const { format } = require('date-fns');
const IQAirServices = require('../services/IQairServices');

class AirQualityController {
    constructor() {}

    _getAQICategory(aqius) {
        const iqairDetail = iqairCategory.find((category) => {
            return aqius <= category[thresholdLevel];
        });

        let { description, emoji, flag, level } = iqairDetail;
        return { description, emoji, flag, level };
    }

    async callAirQualityByLatLong(latitude, longitude) {
        try {
            const iqairServices = new IQAirServices();
            const { data } = await iqairServices.getAirQualityByLatLong(
                latitude,
                longitude
            );
            const { city, state, country, current } = data;

            if (!city || !state || !country || !current) {
                throw new Error('Incomplete data received from AirVisual API');
            }

            const { weather, pollution } = current;
            const { tp, pr, hu, ws, wd } = weather;
            const { aqius } = pollution;

            const { description, emoji, flag, level } =
                this._getAQICategory(aqius);

            const DATE_FORMAT = 'dd MMM yyyy hh:mm aaaa';

            const location = `<a><b>${city}, ${state}, ${country}</b> 📍 </a>`;
            const time = `<a>Date Time: <b>${format(new Date(), DATE_FORMAT)}</b></a>`;
            const weatherData = `<a>Temperature: <b>${tp}°C</b></a>`;
            const pollutionData = `<a>AQI: <b>${aqius}</b></a>`;
            const advice = `<a><b><i>${level}</i></b> ${description} ${emoji}</a>`;

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
