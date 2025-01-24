const axios = require('axios');

const IQ_AIR_URL = 'https://api.airvisual.com/v2';
const IQ_AIR_API_KEY = process.env.IQ_AIR_API_KEY;

class IQAirServices {
    constructor() {}

    async getAirQualityByLatLong(latitude, longitude) {
        try {
            // Construct the URL for the AirVisual API
            const url = `${IQ_AIR_URL}/nearest_city?lat=${latitude}&lon=${longitude}&key=${IQ_AIR_API_KEY}`;
            // Fetch the air quality data
            return axios.get(url).then((res) => res.data);
        } catch (error) {
            console.error('Error fetching air quality data:', error);
            throw new Error(
                'Unable to fetch air quality data. Please try again later.'
            );
        }
    }
}

module.exports = IQAirServices;
