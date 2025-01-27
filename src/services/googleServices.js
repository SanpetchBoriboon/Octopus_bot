const axios = require('axios');

class GoogleService {
    constructor(apiKey, googleUrl) {
        this.apiKey = apiKey;
        this.googleUrl = googleUrl;
    }

    async getLocationFromLatLong(lat, lng, language = 'en') {
        try {
            const response = await axios.get(
                this.googleUrl,
                {
                    params: {
                        latlng: `${lat},${lng}`,
                        key: this.apiKey,
                        language: language,
                    },
                }
            );

            const result = response.data.results[0];

            if (result) {
                if(result.formatted_address.includes(',')) {
                    return result.formatted_address.split(',').slice(1, 5).join(' ').trim();
                } else {
                    return result.formatted_address.split(' ').slice(1, 6).join(' ').trim();
                }
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const googleService = new GoogleService(process.env.GOOGLE_API_KEY, process.env.GOOGLE_URL);

module.exports = googleService;