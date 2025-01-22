const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });
console.log('Bot is running...');
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  } else {
    bot.sendMessage(chatId, messageText);
  }
});