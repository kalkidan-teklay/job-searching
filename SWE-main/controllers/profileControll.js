const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');
const Employer = require('../models/employerModel');
const Profile = require('../models/profileModel');


// Render profile page
const renderProfilePage = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userType = req.user.role === 'student' ? 'Student' : 'Employer'; // Assuming req.user has a `role` field
    
    console.log('User ID:', userId);
    const profile = await Profile.findOne({ user: userId }).populate('user');
    console.log('Profile:', profile);

    if (!profile) {
        return res.status(404).send('Profile not found');
    }

    res.render('profile', { title: 'Profile', profile, role: req.user.role  });
    console.log('role: ', req.user.role)
});

// Create profile after user registration
const createProfileForUser = asyncHandler(async (userId, userType) => {
    const profile = new Profile({ user: userId, userType });
    await profile.save();
});

// Update profile
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updateValues = req.body;

    const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: updateValues },
        { new: true, runValidators: true }
    );

    if (!profile) {
        return res.status(404).send('Profile not found');
    }

    res.status(200).json(profile);
});

// Delete profile
const deleteProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const profile = await Profile.findOneAndDelete({ user: userId });

    if (!profile) {
        return res.status(404).send('Profile not found');
    }

    res.status(200).send('Profile deleted successfully');
});

module.exports = { renderProfilePage, createProfileForUser, updateProfile, deleteProfile};
