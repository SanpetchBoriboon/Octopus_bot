function command(command) {
    let response = {};
    switch (command) {
        case "start":
            response = {
                text: "Hello, I am a bot that can help you check the air quality around you. To get started, type /iqair",
            };
            break;
        case "iqair":
            response = {
                text: "Share your location",
                opts: {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: "My Location",
                                    request_location: true,
                                },
                            ],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                },
            };
            break;
        default:
            response = {
                text: "Invalid command. Please type /start to get started or /iqair to check the air quality around you",
            };
            break;
    }
    return response;
}

module.exports = { command };
