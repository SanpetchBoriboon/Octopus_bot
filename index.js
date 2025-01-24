const { Bot, session } = require('grammy');
const AirQualityController = require('./src/controllers/iqairControllers');

const bot = new Bot(process.env.BOT_TOKEN);

const COMMANDS = [
    { command: 'start', description: 'Start interacting with the bot' },
    { command: 'iqair', description: 'Check the air quality' },
];

bot.api.setMyCommands(COMMANDS);

bot.use(session());

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
bot.command('iqair', (ctx) => {
    const keyboard = {
        keyboard: [
            [
                {
                    text: 'My Location',
                    request_location: true,
                },
            ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        remove_keyboard: true,
    };

    return ctx.reply('Share your location !', {
        reply_markup: keyboard,
    });
});

bot.on(':text', (ctx) => ctx.reply('Text!'));
bot.on(':photo', (ctx) => ctx.reply('Photo!'));
bot.on(':location', async (ctx) => {
    const { latitude, longitude } = ctx.message.location;
    const iqairController = new AirQualityController();
    const { messageText } = await iqairController.callAirQualityByLatLong(
        latitude,
        longitude
    );
    return ctx.reply(messageText, { parse_mode: 'HTML' });
});

bot.start();
