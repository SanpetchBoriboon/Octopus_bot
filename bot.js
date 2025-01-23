const TelegramBot = require("node-telegram-bot-api");
const AirQuality = require("./src/iq-air");

const token = process.env.BOT_TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

bot.on("message", async (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    if (msg.text?.charAt(0) === "/") {
        const messageText = msg.text;
        const command = messageText.slice(1).toLocaleLowerCase();
        switch (command) {
            case "start":
                bot.sendMessage(chatId, "Hello, I am bot to check air quality. Type /iqair to check air quality.");
                break;
            case "iqair":
                bot.sendMessage(chatId, "Share your location", {
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [
                            [
                                {
                                    text: "My location!",
                                    request_location: true,
                                },
                            ],
                        ],
                    },
                });
                break;
            default:
                bot.sendMessage(chatId, "I don't understand you!");
        }
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