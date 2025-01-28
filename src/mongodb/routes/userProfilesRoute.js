const express = require('express');
const UserProfileModel = require('../models/userProfileModel');

class UserProfilesRoute {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/getProfiles', this.getProfiles);
        this.router.get('/getProfile/:Id', this.getProfile);
        this.router.post('/newProfile', this.newProfile);
        this.router.put('/updateProfile/:Id', this.updateProfile);
    }

    async getProfiles(req, res) {
        try {
            const userProfiles = await UserProfileModel.find({});
            res.json(userProfiles);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async getProfile(req, res) {
        const { Id } = req.params;
        try {
            const userProfile = await UserProfileModel.findOne({ userId: Id });
            if (!userProfile) {
                return res.json(null);
            }
            res.json(userProfile);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async newProfile(req, res) {
        const { userId, settingLanguage } = req.body;
        const newUserProfile = new UserProfileModel({
            userId,
            settingLanguage,
        });

        try {
            const userProfile = await newUserProfile.save();
            res.json(userProfile);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async updateProfile(req, res) {
        const { Id } = req.params;
        const { settingLanguage } = req.body;

        try {
            const userProfile = await UserProfileModel.findOneAndUpdate(
                { userId: Id },
                { settingLanguage },
                { new: true }
            );
            res.json(userProfile);
        } catch (err) {
            res.status(400).json(err);
        }
    }
}

module.exports = new UserProfilesRoute().router;
