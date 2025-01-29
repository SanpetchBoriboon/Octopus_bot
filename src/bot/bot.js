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
        const userProfile =
            await this.userProfileController.getUserProfile(userId);
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
                        [
                            {
                                text: EN.LANGUAGE_OPTIONS['en'],
                                callback_data: 'selected_en',
                            },
                        ],
                        [
                            {
                                text: TH.LANGUAGE_OPTIONS['th'],
                                callback_data: 'selected_th',
                            },
                        ],
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

        await ctx.reply(shareLocation, { reply_markup: keyboard });
    }

    async handleLanguage(ctx) {
        try {
            const userId = ctx.chat.id;
            const { userProfile, lang } = await this.getUserProfile(userId);
            if (!userProfile) {
                await ctx.reply('Please start the bot first');
            } else {
                const messages = lang === 'en' ? EN : TH;
                const { LANGUAGE_OPTIONS, SETTING_LANGUAGE, CHOICE_LANGUAGE } =
                    messages;
                await ctx.reply(SETTING_LANGUAGE);
                await ctx.reply(CHOICE_LANGUAGE, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: LANGUAGE_OPTIONS['en'],
                                    callback_data: 'en',
                                },
                            ],
                            [
                                {
                                    text: LANGUAGE_OPTIONS['th'],
                                    callback_data: 'th',
                                },
                            ],
                        ],
                    },
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async handleIQAirLocation(ctx) {
        try {
            const userId = ctx.chat.id;
            const { lang } = await this.getUserProfile(userId);
            const { latitude, longitude } = ctx.message.location;
            const { messageText } =
                await this.iqairController.callAirQualityByLatLong(
                    latitude,
                    longitude,
                    lang
                );
            await ctx.reply(messageText, { parse_mode: 'HTML' });
        } catch (error) {
            throw new Error(error);
        }
    }

    async handleCallbackQuery(ctx) {
        try {
            const data = ctx.callbackQuery.data;
            const userId = ctx.chat.id;
            switch (data) {
                case 'en':
                    await this.userProfileController.settingLanguage(
                        userId,
                        'en'
                    );
                    const selectedMessageEn = `${EN.LANGUAGE_SELECTED} ${EN.LANGUAGE_OPTIONS['en']}`;
                    await ctx.answerCallbackQuery({
                        text: selectedMessageEn,
                    });
                    await ctx.reply(selectedMessageEn);
                    await ctx.reply(EN.QUESTION_FOR_HELP);
                    await ctx.reply(EN.START);
                    await ctx.reply(EN.SETTING_LANGUAGE);
                    break;
                case 'th':
                    await this.userProfileController.settingLanguage(
                        userId,
                        'th'
                    );
                    const selectedMessageTH = `${TH.LANGUAGE_SELECTED} ${TH.LANGUAGE_OPTIONS['th']}`;
                    await ctx.answerCallbackQuery({
                        text: selectedMessageTH,
                    });
                    await ctx.reply(selectedMessageTH);
                    await ctx.reply(TH.QUESTION_FOR_HELP);
                    await ctx.reply(TH.START);
                    await ctx.reply(TH.SETTING_LANGUAGE);
                    break;
                case 'selected_th':
                    await this.userProfileController
                        .newUserProfile(userId, 'th')
                        .then(async () => {
                            await ctx.reply(TH.WELCOME);
                            await ctx.reply(TH.START);
                            await ctx.reply(TH.SETTING_LANGUAGE);
                        })
                        .catch((error) => {
                            throw new Error(error);
                        });
                    break;
                case 'selected_en':
                    await this.userProfileController
                        .newUserProfile(userId, 'en')
                        .then(async () => {
                            await ctx.reply(EN.WELCOME);
                            await ctx.reply(EN.START);
                            await ctx.reply(EN.SETTING_LANGUAGE);
                        })
                        .catch((error) => {
                            throw new Error(error);
                        });
                    break;
                default:
                    break;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = OctopusBot;
