const { EN, TH } = require('../iqairCategory.json');
const { format } = require('date-fns');
const { th } = require('date-fns/locale');
const IQAirServices = require('../services/iqairServices');
const GoogleService = require('../services/googleServices');

class IQAirController {
    constructor(lang) {
        this.lang = lang;
        this.iqairCategory = [];
    }

    getAQICategory(aqius) {
        if (this.lang === 'en') {
            this.iqairCategory = EN['IQAIR_CATEGORY'];
        } else {
            this.iqairCategory = TH['IQAIR_CATEGORY'];
        }

        const iqairDetail = this.iqairCategory.find((category) => {
            return aqius <= category['thresholdLevel'];
        });

        let { description, emoji, flag, level } = iqairDetail;
        return { description, emoji, flag, level };
    }

    async callAirQualityByLatLong(latitude, longitude) {
        try {
            const googleService = new GoogleService();
            const getLocation = await googleService.getLocationFromLatLong(
                latitude,
                longitude,
                this.lang
            );
            const iqairServices = new IQAirServices();
            const { data } = await iqairServices.getAirQualityByLatLong(
                latitude,
                longitude
            );

            const { current } = data;

            if (!current) {
                throw new Error('Incomplete data received from AirVisual API');
            }

            const { weather, pollution } = current;
            const { tp, pr, hu, ws, wd } = weather;
            const { aqius } = pollution;

            const { description, emoji, flag, level } =
                this.getAQICategory(aqius);

            const DATE_FORMAT = 'dd MMMM yyyy HH:mm';
            const date = new Date();
            const formattedDateWithBE = `${format(date, 'dd MMMM')} ${Number(format(date, 'yyyy')) + 543} ${format(date, 'HH:mm')}`;

            let localeTime =
                this.lang === 'en'
                    ? `${format(date, DATE_FORMAT)}`
                    : `${formattedDateWithBE}`;
            let attribute =
                this.lang === 'en'
                    ? level + ' air quality'
                    : 'คุณภาพอากาศ' + level;

            const location = `<a>🌏 <b>${getLocation}</b> 📍 </a>`;
            const time = `<a>🗓️ <b>${localeTime}</b></a>`;
            const weatherData = `<a>🌡️ <b>${tp}°C</b></a>`;
            const pollutionData = `<a>☁️ <b>${aqius}</b></a>`;
            const advice = `<a><b><i>${attribute} ${emoji}</i></b>\n${description}</a>`;

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

module.exports = IQAirController;
