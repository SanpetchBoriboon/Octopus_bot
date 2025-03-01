const { Bot, session } = require('grammy');
const { COMMANDS } = require('../commands.json');
const { EN, TH } = require('../translation/tanslationMessages');
const UserProfileController = require('../mongodb/controllers/userProfileControllers');
const AirQualityController = require('../controllers/iqairControllers');

class OctopusBot {
    constructor(token) {
        this.bot = new Bot(token);
        this.userProfileController = new UserProfileController();
        this.iqairController = new AirQualityController();
        this.initialize();
    }

    async getUserProfile(userId) {
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
        this.bot.on(':location', this.handleIQAirLocation.bind(this));
        this.bot.on('callback_query:data', this.handleCallbackQuery.bind(this));
    }

    async handleStart(ctx) {
        const userId = ctx.chat.id;
        const { userProfile, lang } = await this.getUserProfile(userId);
        if (!userProfile) {
            await ctx.reply('Please set the language first | กรุณาตั้งค่าภาษาก่อน');
            await ctx.reply(`${EN.CHOICE_LANGUAGE} | ${TH.CHOICE_LANGUAGE}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: EN.LANGUAGE_OPTIONS['en'], callback_data: 'selected_en' }],
                        [{ text: TH.LANGUAGE_OPTIONS['th'], callback_data: 'selected_th' }],
                    ],
                },
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
        const { lang } = await this.getUserProfile(userId);
        const messages = lang === 'en' ? EN : TH;
        const keyboard = {
            keyboard: [[{ text: messages.MY_LOCATION, request_location: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
            remove_keyboard: true,
        };

        await ctx.reply(messages.SHARE_LOCATION, { reply_markup: keyboard });
    }

    async handleLanguage(ctx) {
        const userId = ctx.chat.id;
        const { userProfile, lang } = await this.getUserProfile(userId);
        if (!userProfile) {
            await ctx.reply('Please start the bot first');
        } else {
            const messages = lang === 'en' ? EN : TH;
            await ctx.reply(messages.SETTING_LANGUAGE);
            await ctx.reply(messages.CHOICE_LANGUAGE, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: messages.LANGUAGE_OPTIONS['en'], callback_data: 'en' }],
                        [{ text: messages.LANGUAGE_OPTIONS['th'], callback_data: 'th' }],
                    ],
                },
            });
        }
    }

    async handleIQAirLocation(ctx) {
        const userId = ctx.chat.id;
        const { lang } = await this.getUserProfile(userId);
        const { latitude, longitude } = ctx.message.location;
        const { messageText } = await this.iqairController.callAirQualityByLatLong(latitude, longitude, lang);
        await ctx.reply(messageText, { parse_mode: 'HTML' });
    }

    async handleCallbackQuery(ctx) {
        const data = ctx.callbackQuery.data;
        const userId = ctx.chat.id;
        const langOptions = { en: EN, th: TH };

        if (data in langOptions) {
            await this.userProfileController.settingLanguage(userId, data);
            const selectedMessage = `${langOptions[data].LANGUAGE_SELECTED} ${langOptions[data].LANGUAGE_OPTIONS[data]}`;
            await ctx.answerCallbackQuery({ text: selectedMessage });
            await ctx.reply(selectedMessage);
            await ctx.reply(langOptions[data].QUESTION_FOR_HELP);
            await ctx.reply(langOptions[data].START);
            await ctx.reply(langOptions[data].SETTING_LANGUAGE);
        } else if (data.startsWith('selected_')) {
            const selectedLang = data.split('_')[1];
            await this.userProfileController.newUserProfile(userId, selectedLang)
                .then(async () => {
                    await ctx.reply(langOptions[selectedLang].WELCOME);
                    await ctx.reply(langOptions[selectedLang].START);
                    await ctx.reply(langOptions[selectedLang].SETTING_LANGUAGE);
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }
    }
}

module.exports = OctopusBot;
