const TelegramBot = require("node-telegram-bot-api");
const AirQuality = require("./src/iq-air");
const { command } = require("./src/command");

const token = process.env.BOT_TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

bot.on("message", async (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    if (msg.text?.charAt(0) === "/") {
        const messageText = msg.text.slice(1).toLocaleLowerCase();
        const { text, opts } = command(messageText);
        bot.sendMessage(chatId, text, opts || {});
    } else {
        if (msg.location) {
            const iqair = new AirQuality({ pollution: msg.location });
            const { messageText, colorCode } = await iqair.getAirQualityByLatLong();
            bot.sendMessage(chatId, messageText, { parse_mode: "HTML" });
        }
    }
});

bot.on("polling_error", (error) => {
    console.log(`[polling_error] ${error.code}: ${error.message}`);
});