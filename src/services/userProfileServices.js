const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const SERVER_URL = process.env.MONGO_SERVICE;

class UserProfileServices {
    async getUserProfile(Id) {
        try {
            const response = await axios.get(SERVER_URL + '/getProfile/' + Id);
            return response.data;
        } catch (error) {
            throw new Error(
                'Unable to fetch user profile data. Please try again later.'
            );
        }
    }

    async newUserProfile(userId, settingLanguage) {
        try {
            const response = await axios.post(SERVER_URL + '/newProfile', {
                userId,
                settingLanguage,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                'Unable to create new user profile. Please try again later.'
            );
        }
    }

    async updateUserProfile(userId, language) {
        try {
            const response = await axios.put(
                SERVER_URL + '/updateProfile/' + userId,
                {
                    settingLanguage: language,
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(
                'Unable to update user profile. Please try again later.'
            );
        }
    }
}

module.exports = UserProfileServices;
