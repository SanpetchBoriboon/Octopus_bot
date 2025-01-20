const { axiosInstance } = require("./axios");

function sendMessage(messageObj, messageText) {
    return axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: messageText,
    });
}

function handleMessage(messageObj) {
    const messageText = messageObj.text;

    if(messageText.charAt(0) === "/") {
        const command = messageText.substr(1);
        switch(command) {
            case "start":
                return sendMessage(messageObj, "Hello, I am a bot!");
            case "help":
                return sendMessage(messageObj, "I can't help you!");
            default:
                return sendMessage(messageObj, "I don't understand you!");
        }
    } else {
        return sendMessage(messageObj, messageText);
    }
}

module.exports = { handleMessage };