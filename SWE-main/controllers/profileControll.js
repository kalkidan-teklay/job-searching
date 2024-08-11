const asyncHandler = require("express-async-handler");
const User = require('../models/studentModel');
const Profile = require('../models/profileModel');


//profile page
const renderProfilePage = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Now you can render the profile page using the found user
        res.render('profile', { title: 'Profile', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// editing profile

async function updateUserById(userId,updateValues){
    try {
        const result = User.updateOne({_id:userId}, {$set: updateValues });
        if ( result === 0){
            throw new Error('User nor found or values not modfified');
        }
        return result;
    }
    catch(error){
        throw new Error('Error Updating user');
    }
}


async function deleteUserById(userId){
    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            throw new Error('User not found');
        }

        // console.log(`User with ID ${userId} has been deleted successfully.`);
        return deletedUser;
    }
    catch(error){
        throw new Error('Error deleting user');
    }
}
module.exports = { renderProfilePage, updateUserById, deleteUserById };
