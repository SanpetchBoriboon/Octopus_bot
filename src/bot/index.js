const OctopusBot = require('./bot');

exports.run = function (botToken) {
    new OctopusBot(botToken);
};
