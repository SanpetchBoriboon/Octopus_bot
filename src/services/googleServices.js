const axios = require('axios');
const { GOOGLE_API_KEY, GOOGLE_URL } = process.env;

class GoogleService {
    constructor() {
        this.apiKey = GOOGLE_API_KEY;
        this.googleUrl = GOOGLE_URL;
    }

    async getLocationFromLatLong(latitude, longitude, language = 'en') {
        try {
            const latlag = [latitude, longitude].join(',');
            const response = await axios.get(this.googleUrl, {
                params: {
                    latlng: latlag,
                    key: this.apiKey,
                    language: language,
                },
            });

            const result = response.data.results[0];

            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Unable to get location from Google API');
        }
    }
}

module.exports = GoogleService;
