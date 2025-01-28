const axios = require('axios');
const { GOOGLE_API_KEY, GOOGLE_URL } = process.env;

class GoogleService {
    constructor() {
        this.apiKey = GOOGLE_API_KEY;
        this.googleUrl = GOOGLE_URL;
    }

    async getLocationFromLatLong(lat, lng, language = 'en') {
        try {
            const response = await axios.get(this.googleUrl, {
                params: {
                    latlng: `${lat},${lng}`,
                    key: this.apiKey,
                    language: language,
                },
            });

            const result = response.data.results[0];

            if (result) {
                const address = result.address_components
                    .filter(
                        (address) =>
                            address.types.includes('political') ||
                            address.types.includes('postal_code')
                    )
                    .map((address) => address.long_name)
                    .join(', ');
                return address;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = GoogleService;
