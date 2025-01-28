const { EN, TH } = require('../iqairCategory.json');
const { format } = require('date-fns');
const { th } = require('date-fns/locale');
const IQAirServices = require('../services/iqairServices');
const GoogleController = require('./googleControllers');

class IQAirController {
    constructor() {}

    getAQICategory(aqius, lang) {
        let iqairCategory = [];
        if (lang === 'en') {
            iqairCategory = EN['IQAIR_CATEGORY'];
        } else {
            iqairCategory = TH['IQAIR_CATEGORY'];
        }

        const iqairDetail = iqairCategory.find((category) => {
            return aqius <= category['thresholdLevel'];
        });

        let { description, emoji, flag, level } = iqairDetail;
        return { description, emoji, flag, level };
    }

    async callAirQualityByLatLong(latitude, longitude, lang) {
        try {
            const googleController = new GoogleController();
            const getLocation = await googleController.getLocationFromLatLong(
                latitude,
                longitude,
                lang
            );
            const iqairServices = new IQAirServices();
            const { data } = await iqairServices.getAirQualityByLatLong(
                latitude,
                longitude
            );

            const { current } = data;
            const { weather, pollution } = current;
            const { tp, pr, hu, ws, wd } = weather;
            const { aqius } = pollution;

            const { description, emoji, flag, level } = this.getAQICategory(
                aqius,
                lang
            );

            const DATE_FORMAT = 'dd MMMM yyyy HH:mm';
            const date = new Date();
            const formattedDateWithBE = `${format(date, 'dd MMMM', { locale: th })} ${Number(format(date, 'yyyy')) + 543} ${format(date, 'HH:mm')}`;

            let localeTime = '';
            let attribute = '';

            switch (lang) {
                case 'en':
                    localeTime = `${format(date, DATE_FORMAT)}`;
                    attribute = `${level} air quality`;
                    break;
                case 'th':
                    localeTime = `${formattedDateWithBE}`;
                    attribute = `คุณภาพอากาศ${level}`;
                    break;
                default:
                    break;
            }

            const location = `<a>🌏 <b>${getLocation}</b> 📍 </a>`;
            const time = `<a>🗓️ <b>${localeTime}</b></a>`;
            const weatherData = `<a>🌡️ <b>${tp}°C</b></a>`;
            const pollutionData = `<a>☁️ <b>${aqius}</b></a>`;
            const advice = `<a><b><i>${attribute} ${emoji}</i></b>\n${description}</a>`;

            const messageText = `${location}\n${time}\n${weatherData}\n${pollutionData} ${flag}\n\n${advice}`;

            return { messageText };
        } catch (error) {
            return {
                messageText:
                    'Unable to fetch air quality data. Please try again later.',
            };
        }
    }
}

module.exports = IQAirController;
