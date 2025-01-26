const { Bot, session } = require('grammy');
const { COMMANDS } = require('./src/commands');
const { LocationMessage } = require('./src/handleMessages');

const bot = new Bot(process.env.BOT_TOKEN);

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

bot.on(':text', (ctx) => {
    console.log(ctx.message);
    return ctx.reply('Text!');
});
bot.on(':photo', (ctx) => ctx.reply('Photo!'));
bot.on(':location', async (ctx) => {
    const locationMessage = new LocationMessage(ctx);
    return await locationMessage.replyAqiLocation();
});

bot.start();
