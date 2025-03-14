const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const IQ_AIR_URL = process.env.IQ_AIR_URL;
const IQ_AIR_API_KEY = process.env.IQ_AIR_API_KEY;

class IQAirServices {
    constructor() {}

    async getAirQualityByLatLong(latitude, longitude) {
        try {
            const url = `${IQ_AIR_URL}/nearest_city?lat=${latitude}&lon=${longitude}&key=${IQ_AIR_API_KEY}`;
            return axios.get(url).then((res) => res.data);
        } catch (error) {
            throw new Error(
                'Unable to fetch air quality data. Please try again later.'
            );
        }
    }
}

module.exports = IQAirServices;
