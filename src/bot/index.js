var OctopusBot = require('./bot');

var run = function () {
    new OctopusBot(process.env.BOT_TOKEN);
};

exports.run = run;
