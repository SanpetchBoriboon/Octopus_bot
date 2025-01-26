// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const MessageModel = require('./schemas/messageModel');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

app.get('/getMessages', (req, res) => {
    MessageModel.find({})
        .then((messages) => res.json(messages))
        .catch((err) => res.status(400).json(err));
});

app.post('/addMessage', (req, res) => {
    const { messageText, messageLocation, chatId, date } = req.body;
    const newMessage = new MessageModel({
        messageText,
        messageLocation,
        chatId,
        date,
    });

    newMessage
        .save()
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json(err));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
