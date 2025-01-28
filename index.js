const { Bot, session } = require('grammy');
const { COMMANDS } = require('./src/commands.json');
const { EN, TH } = require('./src/translation/tanslationMessages');
const { LocationMessage } = require('./src/handleMessages');
const UserProfileController = require('./src/controllers/userProfileControllers');

class OctopusBot {
    constructor(token) {
        this.bot = new Bot(token);
        this.userProfileController = new UserProfileController();
        this.initialize();
    }

    async getUserLanguageSettings(userId) {
        const userProfile = await this.userProfileController.getUserProfile(userId);
        const lang = userProfile?.settingLanguage === 'en' ? 'en' : 'th';
        return { userProfile, lang };
    }

    initialize() {
        this.bot.api.setMyCommands(COMMANDS);
        this.bot.use(session());
        this.setupCommands();
        this.setupListeners();
        this.bot.start();
    }

    setupCommands() {
        this.bot.command('start', this.handleStart.bind(this));
        this.bot.command('iqair', this.handleIqair.bind(this));
        this.bot.command('language', this.handleLanguage.bind(this));
    }

    setupListeners() {
        this.bot.on(':text', (ctx) => ctx.reply('Text!'));
        this.bot.on(':photo', (ctx) => ctx.reply('Photo!'));
        this.bot.on(':location', this.handleLocation.bind(this));
        this.bot.on('callback_query:data', this.handleCallbackQuery.bind(this));
    }

    async handleStart(ctx) {
        const userId = ctx.chat.id;
        const { userProfile, lang } = await this.getUserLanguageSettings(userId);
        if (!userProfile) {
            await this.userProfileController
                .newUserProfile(userId, 'th')
                .then(async () => {
                    await ctx.reply(TH.WELCOME);
                    await ctx.reply(TH.START);
                    await ctx.reply(TH.SETTING_LANGUAGE);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            const messages = lang === 'en' ? EN : TH;
            await ctx.reply(messages.WELCOME);
            await ctx.reply(messages.START);
            await ctx.reply(messages.SETTING_LANGUAGE);
        }
    }

    async handleIqair(ctx) {
        const userId = ctx.chat.id;
        const { lang } = await this.getUserLanguageSettings(userId);
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
    }

    async handleLanguage(ctx) {
        try {
            const userId = ctx.chat.id;
            const { userProfile, lang } = await this.getUserLanguageSettings(userId);
            if (!userProfile) {
                return ctx.reply('Please start the bot first');
            }
            const messages = lang === 'en' ? EN : TH;
            const languageOptions =
                lang === 'en'
                    ? { en: 'English', th: 'Thai' }
                    : { en: 'อังกฤษ', th: 'ไทย' };

            await ctx.reply(messages.SETTING_LANGUAGE);
            await ctx.reply(
                lang === 'en' ? 'Choose your language' : 'เลือกภาษาของคุณ',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: languageOptions['en'],
                                    callback_data: 'en',
                                },
                            ],
                            [
                                {
                                    text: languageOptions['th'],
                                    callback_data: 'th',
                                },
                            ],
                        ],
                    },
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    async handleLocation(ctx) {
        try {
            const userId = ctx.chat.id;
            const { lang } = await this.getUserLanguageSettings(userId);
            const locationMessage = new LocationMessage(ctx, lang);
            const message = await locationMessage.replyAqiLocation();
            await ctx.reply(message, { parse_mode: 'HTML' });
        } catch (error) {
            console.error(error);
        }
    }

    async handleCallbackQuery(ctx) {
        try {
            const data = ctx.callbackQuery.data;
            let language = '';

            switch (data) {
                case 'en':
                    await this.userProfileController.settingLanguage(
                        ctx.chat.id,
                        'en'
                    );
                    language = 'English';
                    await ctx.answerCallbackQuery({
                        text: `Selected ${language}`,
                    });
                    await ctx.reply(`You changed the language to ${language}`);
                    await ctx.reply('Do you want anything else?');
                    await ctx.reply(EN.START);
                    await ctx.reply(EN.SETTING_LANGUAGE);
                    break;
                case 'th':
                    await this.userProfileController.settingLanguage(
                        ctx.chat.id,
                        'th'
                    );
                    language = 'ไทย';
                    await ctx.answerCallbackQuery({
                        text: `คุณเลือกภาษา ${language}`,
                    });
                    await ctx.reply(`คุณได้เปลี่ยนเป็นภาษา ${language}`);
                    await ctx.reply('คุณต้องการอะไรเพิ่มเติมหรือไม่?');
                    await ctx.reply(TH.START);
                    await ctx.reply(TH.SETTING_LANGUAGE);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

new OctopusBot(process.env.BOT_TOKEN);


