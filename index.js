const { Bot, session } = require('grammy');
const { COMMANDS } = require('./src/commands.json');
const { EN, TH } = require('./src/translation/tanslationMessages');
const { LocationMessage } = require('./src/handleMessages');
const UserProfileController = require('./src/controllers/userProfileControllers');

const bot = new Bot(process.env.BOT_TOKEN);
const userProfileController = new UserProfileController();

bot.api.setMyCommands(COMMANDS);
bot.use(session());

bot.command('start', async (ctx) => {
    const userProfile = await userProfileController.getUserProfile(ctx.chat.id);
    const lang = userProfile?.settingLanguage === 'en' ? 'en' : 'th';
    if (!userProfile) {
        await userProfileController
            .newUserProfile(ctx.chat.id, 'en')
            .then(() => {
                ctx.reply(EN.WELCOME);
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        switch (lang) {
            case 'en':
                await ctx.reply(EN.WELCOME);
                await ctx.reply(EN.START);
                await ctx.reply(EN.SETTING_LANGUAGE);
                break;
            case 'th':
                await ctx.reply(TH.WELCOME);
                await ctx.reply(TH.START);
                await ctx.reply(TH.SETTING_LANGUAGE);
                break;
            default:
                break;
        }
    }
});

bot.command('iqair', async (ctx) => {
    const userProfile = await userProfileController.getUserProfile(ctx.chat.id);
    const lang = userProfile?.settingLanguage === 'en' ? 'en' : 'th';
    let myLocation = '';
    let shareLocation = '';
    switch (lang) {
        case 'en':
            myLocation = EN.MY_LOCATION;
            shareLocation = EN.SHARE_LOCATION;
            break;
        case 'th':
            myLocation = TH.MY_LOCATION;
            shareLocation = TH.SHARE_LOCATION;
            break;
        default:
            break;
    }

    const keyboard = {
        keyboard: [
            [
                {
                    text: myLocation,
                    request_location: true,
                },
            ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        remove_keyboard: true,
    };

    ctx.reply(shareLocation, { reply_markup: keyboard });
});

bot.command('language', async (ctx) => {
    try {
        const userProfile = await userProfileController.getUserProfile(
            ctx.chat.id
        );
        if (!userProfile) {
            return ctx.reply('Please start the bot first');
        }

        const lang = userProfile.settingLanguage;

        let message = '';
        let messageSetting = '';
        let language = {};
        switch (lang) {
            case 'en':
                message = 'Choose your language';
                messageSetting = 'English is your primary language';
                language = {
                    en: 'English',
                    th: 'Thai',
                };
                break;
            case 'th':
                message = 'เลือกภาษาของคุณ';
                messageSetting = 'ภาษาไทยเป็นภาษาหลักของคุณ';
                language = {
                    en: 'อังกฤษ',
                    th: 'ไทย',
                };
                break;
            default:
                break;
        }

        await ctx.reply(messageSetting);
        await ctx.reply(message, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: language['en'], callback_data: 'en' }],
                    [{ text: language['th'], callback_data: 'th' }],
                ],
            },
        });
    } catch (error) {
        console.error(error);
    }
});

bot.on(':text', (ctx) => ctx.reply('Text!'));
bot.on(':photo', (ctx) => ctx.reply('Photo!'));
bot.on(':location', async (ctx) => {
    (ctx.message.location);
    const settingLanguage = await userProfileController
        .getUserProfile(ctx.chat.id)
        .then((res) => res.settingLanguage)
        .catch((error) => console.error(error));
    (settingLanguage);
    const locationMessage = new LocationMessage(ctx, settingLanguage);
    const message = await locationMessage.replyAqiLocation();
    await ctx.reply(message, {
        parse_mode: 'HTML',
    });
});

bot.on('callback_query:data', async (ctx) => {
    try {
        const data = ctx.callbackQuery.data;
        let language = '';

        switch (data) {
            case 'en':
                await userProfileController.settingLanguage(ctx.chat.id, 'en');
                language = 'English';
                await ctx.answerCallbackQuery({ text: `Selected ${language}` });
                await ctx.reply(`You changed the language to ${language}`);
                await ctx.reply('Do you want anything else?');
                break;
            case 'th':
                await userProfileController.settingLanguage(ctx.chat.id, 'th');
                language = 'ไทย';
                await ctx.answerCallbackQuery({
                    text: `คุณเลือกภาษา ${language}`,
                });
                await ctx.reply(`คุณได้เปลี่ยนเป็นภาษา ${language}`);
                await ctx.reply('คุณต้องการอะไรเพิ่มเติมหรือไม่?');
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(error);
    }
});

bot.start();
