const express = require('express');
const router = express.Router();
const profileControll = require('../controllers/profileControll');

// PUT route to modify profile
router.put('/modify/:id', async (req, res) => {
    const userId = req.params.id;
    const newValues = req.body.updateValues;
    try {
        const result = await profileControll.updateUserById(userId, newValues);
        res.json({ msg: 'Profile modified successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// GET route for profile page
router.get('/', profileControll.renderProfilePage);

// DELETE route to delete profile
router.delete('/modify/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await profileControll.deleteUserById(userId);
        res.json({ msg: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
