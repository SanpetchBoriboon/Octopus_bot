const GoogleService = require('../services/googleServices');

class GoogleController {
    constructor() {}

    async getLocationFromLatLong(latitude, longitude, language) {
        try {
            const googleService = new GoogleService();
            const location = await googleService.getLocationFromLatLong(latitude, longitude, language);

            if (location) {
                const address = location.address_components
                    .filter((address) => address.types.includes('political') || address.types.includes('postal_code'))
                    .map((address) => address.long_name)
                    .join(', ');
                return address;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Unable to fetch location data. Please try again later.');
        }
    }
}

module.exports = GoogleController;
