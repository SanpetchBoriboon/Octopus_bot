const express = require('express');
const axios = require('axios');

const BASE_URL = [process.env.BASE_URL, process.env.BOT_TOKEN].join('');
const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());

app.post('*', async (req, res) => {
    const { body } = req;
    console.log(body);
    let reponse = {};
    if (body) {
        const messageObj = body.message;
        if (messageObj) {
            const messageText = messageObj.text;
            if (messageText.charAt(0) === '/') {
                const command = messageText.substr(1);
                switch (command) {
                    case 'start':
                        reponse = await sendMessage(
                            messageObj,
                            'Hello, I am a bot!'
                        );
                    case 'help':
                        reponse = await sendMessage(
                            messageObj,
                            "I can't help you!"
                        );
                    default:
                        reponse = await sendMessage(
                            messageObj,
                            "I don't understand you!"
                        );
                }
            } else {
                reponse = await sendMessage(messageObj, messageText);
            }
        }
    }
    res.send(reponse.data);
});

app.get('*', async (req, res) => {
    res.send('Hello, I am a bot! get');
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server is running on port ${PORT}`);
});

async function sendMessage(messageObj, text) {
    return await axios.get(`${BASE_URL}/sendMessage`, {
        params: {
            chat_id: messageObj.chat.id,
            text: text,
        },
    });
}
