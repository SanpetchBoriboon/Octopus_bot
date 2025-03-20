const dotenv = require('dotenv');

dotenv.config();

const runBot = require('./src/bot');

runBot.run(process.env.BOT_TOKEN);
