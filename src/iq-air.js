const axios = require("axios");
const { aqi } = require("./aqi-category");
const { format } = require("date-fns");
const IQ_AIR_URL = "https://api.airvisual.com/v2";
const IQ_AIR_API_KEY = process.env.IQ_AIR_API_KEY;

class AirQuality {
    constructor(data) {
        this.city = data.city;
        this.state = data.state;
        this.country = data.country;
        this.pollution = data.pollution;
    }

    async getAirQualityByLatLong() {
        const { latitude, longitude } = this.pollution;
        const url = `${IQ_AIR_URL}/nearest_city?lat=${latitude}&lon=${longitude}&key=${IQ_AIR_API_KEY}`;
        const responseIqair = await axios.get(url);
        const iqairData = responseIqair.data.data;
        const { city, state, country, current } = iqairData;
        const { weather, pollution } = current;
        const { ts, aqius, mainus, aqicn, maincn } = pollution;
        const { tp, pr, hu, ws, wd } = weather;

        let aqiKey = "";

        if (aqius <= 50) {
            aqiKey = "good";
        } else if (aqius > 50 && aqius <= 100) {
            aqiKey = "moderate";
        } else if (aqius > 100 && aqius <= 200) {
            aqiKey = "unhealthyForSensitiveGroups";
        } else if (aqius > 200 && aqius <= 300) {
            aqiKey = "unhealthy";
        } else if (aqius > 300 && aqius <= 400) {
            aqiKey = "veryUnhealthy";
        } else if (aqius > 400) {
            aqiKey = "hazardous";
        }

        const colorCode = aqi[aqiKey].codeColor;

        const location = `<a>Location: <b>${city}, ${state}, ${country}</b></a>`;
        const time = `<a>Time: <b>${format(new Date(), "dd MMM yyyy hh:mm aaaa")}</b></a>`;
        const weatherData = `<a>Temperature: <b>${tp}°C</b></a>`;
        const pollutionData = `<a>AQI: <b>${aqius}</b></a>`;
        const advice = `<a>Advice: <b>${aqi[aqiKey].description}</b></a>`;
        const messageText = `${location}\n${time}\n${weatherData}\n${pollutionData}\n${advice}`;

        return { messageText, colorCode };
    }
}

module.exports = AirQuality;
