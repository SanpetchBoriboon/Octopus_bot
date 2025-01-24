const TelegramBot = require('node-telegram-bot-api');
const AirQualityController = require('../controllers/IQairControllers');
const { command } = require('../command');

const token = process.env.BOT_TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

console.log('Bot is runing...');

bot.on('message', async (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    if (msg.text?.charAt(0) === '/') {
        const messageText = msg.text.slice(1).toLocaleLowerCase();
        const { text, opts } = command(messageText);
        bot.sendMessage(chatId, text, opts || {});
    } else {
        if (msg.location) {
            const { latitude, longitude } = msg.location;
            const iqairController = new AirQualityController();
            const { messageText } =
                await iqairController.callAirQualityByLatLong(
                    latitude,
                    longitude
                );
            bot.sendMessage(chatId, messageText, { parse_mode: 'HTML' });
        }
    }
});

bot.on('polling_error', (error) => {
    console.log(`[polling_error] ${error.code}: ${error.message}`);
});

module.exports = { bot };
