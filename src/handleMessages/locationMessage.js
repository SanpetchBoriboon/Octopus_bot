const AirQualityController = require('../controllers/iqairControllers');

class LocationMessage {
    constructor(ctx) {
        this.ctx = ctx;
    }

    async replyAqiLocation() {
        console.log(this.ctx.message);
        const { latitude, longitude } = this.ctx.message.location;
        const iqairController = new AirQualityController();
        const { messageText } = await iqairController.callAirQualityByLatLong(
            latitude,
            longitude
        );
        return this.ctx.reply(messageText, { parse_mode: 'HTML' });
    }
}

module.exports = LocationMessage;
