const express = require('express');

const UserProfileModel = require('../models/userProfileModel');
const router = express.Router();

router.get('/getProfiles', async (req, res) => {
    await UserProfileModel.find({})
        .then((userProfiles) => res.json(userProfiles))
        .catch((err) => res.status(400).json(err));
});

router.get('/getProfile/:Id', async (req, res) => {
    const { Id } = req.params;
    await UserProfileModel.findOne({ userId: Id })
        .then((userProfile) => {
            if (!userProfile) {
                return res.json(null);
            }
            res.json(userProfile);
        })
        .catch((err) => res.status(400).json(err));
});

router.post('/newProfile', async (req, res) => {
    const { userId, settingLanguage } = req.body;
    const newUserProfile = new UserProfileModel({
        userId,
        settingLanguage,
    });

    await newUserProfile
        .save()
        .then((userProfile) => res.json(userProfile))
        .catch((err) => res.status(400).json(err));
});

router.put('/updateProfile/:Id', async (req, res) => {
    const { Id } = req.params;
    const { settingLanguage } = req.body;

    await UserProfileModel.findOneAndUpdate(
        { userId: Id },
        { settingLanguage },
        { new: true }
    )
        .then((userProfile) => res.json(userProfile))
        .catch((err) => res.status(400).json(err));
});

module.exports = router;
