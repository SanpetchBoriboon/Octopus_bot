const TelegramBot = require('node-telegram-bot-api');
const AirQualityController = require('../controllers/IQairControllers');
const { COMMAND } = require('../commands');

const token = process.env.BOT_TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

console.log('Bot is runing...');

bot.on('message', async (msg) => {
    console.log(msg);
    let { text = null, location = null, chat } = msg;
    const chatId = chat.id;
    if (text) {
        if (text?.charAt(0) === '/') {
            const messageText = text.slice(1).toLocaleLowerCase();
            let { text, opts } = COMMAND(messageText);
            bot.sendMessage(chatId, text, opts || {});
        } else { 
            bot.sendMessage(chatId, "What do you say? I don't understand");
        }
    } else {
        if (location) {
            const { latitude, longitude } = location;
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
