const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    settingLanguage: {
        type: String,
        default: 'en',
        required: true,
    },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
