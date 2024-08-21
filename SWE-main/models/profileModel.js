const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    userType: {
        type: String,
        required: true,
        enum: ['Student', 'Employer'] 
    },
    bio: {
        type: String,
        default: ''
    },
    // Add any other profile-specific fields here
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
