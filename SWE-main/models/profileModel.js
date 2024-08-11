// profileModel.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to your user model
    },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
