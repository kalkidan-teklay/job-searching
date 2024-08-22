const express = require('express');
const router = express.Router();

const checkUser = require('../middleware/userAuthMiddleware');

router.get('/', checkUser, (req, res) => {
    res.render("index");
});

// router.get('/jobs', (req, res) => {
//     res.send('list of jobs');
// });

router.get('/ultimatumLogin', (req, res) => {
    res.render("ultimatumLogin");
})

router.get('/ultimatumSignUp', (req, res) => {
    res.render("ultimatumSignUp");
})

module.exports = router;
