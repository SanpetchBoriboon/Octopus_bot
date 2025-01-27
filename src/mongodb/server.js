// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const port = 3000;

const mongooseURI = process.env.MONGO_DB;

// Middleware
cors();
app.use(bodyParser.json());
app.use('/', routes);

// MongoDB connection
mongoose
    .connect(mongooseURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
