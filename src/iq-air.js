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
        const iqairData = await axios.get(url);
        const { city, state, country, current } = iqairData.data.data;
        const { weather, pollution } = current;
        const { ts, aqius, mainus, aqicn, maincn } = pollution;
        const { tp, pr, hu, ws, wd } = weather;

        let descriptionAdvice = "", emoji = "", flagCondition = "", flagCount = [];

        if (aqius <= 50) {
            let { description, flag } = aqi[Object.keys(aqi)[0]];
            emoji = "😊";
            descriptionAdvice = description;
            flagCondition = flag;
        } else if (aqius > 50 && aqius <= 100) {
            let { description } = aqi[Object.keys(aqi)[1]];
            emoji = "😐";
            descriptionAdvice = description;
            for(let i = 0; i < 2; i++) {
                let { flag } = aqi[Object.keys(aqi)[i]]
                flagCount.push(flag)
            }
            flagCondition = flagCount.join("");
        } else if (aqius > 100 && aqius <= 200) {
            let { description } = aqi[Object.keys(aqi)[2]];
            emoji = "🙁";
            descriptionAdvice = description;
            for(let i = 0; i < 3; i++) {
                let { flag } = aqi[Object.keys(aqi)[i]]
                flagCount.push(flag)
            }
            flagCondition = flagCount.join("");
        } else if (aqius > 200 && aqius <= 300) {
            let { description } = aqi[Object.keys(aqi)[3]];
            emoji = "😰";
            descriptionAdvice = description;
            for(let i = 0; i < 4; i++) {
                let { flag } = aqi[Object.keys(aqi)[i]]
                flagCount.push(flag)
            }
            flagCondition = flagCount.join("");
        } else if (aqius > 300 && aqius <= 400) {
            let { description } = aqi[Object.keys(aqi)[4]];
            emoji = "😱";
            descriptionAdvice = description;
            for(let i = 0; i < 5; i++) {
                let { flag } = aqi[Object.keys(aqi)[i]]
                flagCount.push(flag)
            }
            flagCondition = flagCount.join("");
        } else if (aqius > 400) {
            let { description } = aqi[Object.keys(aqi)[5]];
            emoji = "🤯";
            descriptionAdvice = description;
            for(let i = 0; i < 6; i++) {
                let { flag } = aqi[Object.keys(aqi)[i]]
                flagCount.push(flag)
            }
            flagCondition = flagCount.join("");
        }

        const location = `<a><b>${city}, ${state}, ${country}</b> 📍 </a>`;
        const time = `<a>Date Time: <b>${format(new Date(), "dd MMM yyyy hh:mm aaaa")}</b></a>`;
        const weatherData = `<a>Temperature: <b>${tp}°C</b></a>`;
        const pollutionData = `<a>AQI: <b>${aqius}</b></a>`;
        const advice = `<a><b>${descriptionAdvice}</b> ${emoji}</a>`;
        const messageText = `${location}\n${time}\n${weatherData}\n${pollutionData} ${flagCondition}\n\n${advice}`;

        return { messageText };
    }
}

module.exports = AirQuality;
