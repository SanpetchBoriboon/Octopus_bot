const AirQualityController = require('../controllers/iqairControllers');

class LocationMessage {
    constructor(ctx, settingLanguage) {
        this.ctx = ctx;
        this.settingLanguage = settingLanguage;
        this.iqairController = new AirQualityController(this.settingLanguage);
    }
    async replyAqiLocation() {
        const { latitude, longitude } = this.ctx.message.location;
        const { messageText } =
            await this.iqairController.callAirQualityByLatLong(
                latitude,
                longitude
            );
        return messageText;
    }
}

module.exports = LocationMessage;
