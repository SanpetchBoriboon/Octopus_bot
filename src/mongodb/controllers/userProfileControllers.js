const UserProfileService = require('../../services/userProfileService');

class UserProfileController {
    constructor() {
        this.userProfileService = new UserProfileService();
    }

    async getUserProfile(userId) {
        return this.userProfileService.getUserProfile(userId);
    }

    async newUserProfile(userId, settingLanguage) {
        return this.userProfileService.newUserProfile(userId, settingLanguage);
    }

    async settingLanguage(userId, language) {
        return this.userProfileService.updateUserProfile(userId, language);
    }
}

module.exports = UserProfileController;
